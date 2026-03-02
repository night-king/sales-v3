# Workflow Engine Implementation Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement cross-module workflow logic so the frontend demo behaves like a real system — actions in one module trigger cascading effects across others, with notifications, task chains, and automation execution.

**Architecture:** EventBus (pub/sub) + central WorkflowEngine that listens to typed events and orchestrates cross-store effects. Existing Zustand stores emit events after mutations; WorkflowEngine responds by calling other stores.

**Tech Stack:** TypeScript strict events, Zustand stores (existing), lightweight custom EventBus

---

## Current State (Gap Analysis)

| Area | Status | Gap |
|------|--------|-----|
| Store CRUD | 100% | N/A |
| UI Pages | 100% | N/A |
| Cross-module effects | 0% | No store talks to another |
| Notification generation | 0% | Actions don't create notifications |
| Automation execution | 0% | Rules displayed but never evaluated |
| Client lifecycle transitions | 10% | Only claim/release, no status flow |
| Task chaining | 0% | Completing task doesn't create next |
| Ticket escalation effects | 20% | on_hold is dead-end state |

## Infrastructure Layer

### 1. EventBus (`src/lib/event-bus.ts`)

Typed pub/sub with synchronous emit:

```typescript
type EventMap = {
  // Client events
  'client.claimed': { clientId: string; userId: string }
  'client.released': { clientId: string }
  'client.statusChanged': { clientId: string; from: ClientStatus; to: ClientStatus }

  // Task events
  'task.created': { task: Task }
  'task.statusChanged': { taskId: string; from: TaskStatus; to: TaskStatus; task: Task }
  'task.claimed': { taskId: string; userId: string }
  'task.returned': { taskId: string }

  // Ticket events
  'ticket.created': { ticket: Ticket }
  'ticket.statusChanged': { ticketId: string; from: TicketStatus; to: TicketStatus }
  'ticket.escalated': { ticketId: string; escalation: EscalationRecord }

  // IB events
  'ib.created': { deal: IBDeal }
  'ib.approved': { dealId: string; actor: string }
  'ib.rejected': { dealId: string; actor: string; reason: string }
  'ib.resubmitted': { dealId: string }
  'ib.expired': { dealId: string }

  // Automation
  'automation.ruleToggled': { ruleId: string; enabled: boolean }

  // Simulated CRM events (demo only)
  'crm.clientRegistered': { clientId: string }
  'crm.kycApproved': { clientId: string }
  'crm.kycRejected': { clientId: string }
  'crm.clientFunded': { clientId: string }
  'crm.clientTraded': { clientId: string }
  'crm.ticketCreated': { clientId: string; category: string }
}
```

Implementation: Simple Map<string, Set<callback>>. `emit(event, data)` calls all registered listeners synchronously.

### 2. WorkflowEngine (`src/lib/workflow-engine.ts`)

Central handler. Registers listeners on EventBus at app init. Each listener reads/writes multiple stores:

```
initWorkflowEngine() {
  eventBus.on('client.claimed', handleClientClaimed)
  eventBus.on('client.statusChanged', handleClientStatusChanged)
  eventBus.on('task.statusChanged', handleTaskStatusChanged)
  eventBus.on('ticket.escalated', handleTicketEscalated)
  eventBus.on('ib.approved', handleIBApproved)
  eventBus.on('ib.rejected', handleIBRejected)
  // ... all handlers
}
```

### 3. Store Modifications

Each store action that represents a business event adds an `eventBus.emit()` call after the state mutation. Example:

```typescript
// client-store.ts - enhanced
claimClient: (clientId, userId) => {
  set(state => ({ ... }))
  eventBus.emit('client.claimed', { clientId, userId })
}
```

### 4. NotificationStore Enhancement

Add `addNotification(notification)` action. WorkflowEngine calls this to generate notifications as side effects.

### 5. Initialization

In `main.tsx`: `import { initWorkflowEngine } from '@/lib/workflow-engine'` then call `initWorkflowEngine()` before rendering.

---

## 12 Core Workflows

### Workflow 1: Client Claim Cascade

**Trigger:** `client.claimed`
**Handler:**
1. Create task: `{ type: 'kyc_followup', clientId, assignedTo: userId, priority: 'medium' }`
2. Add notification for claimer: "You claimed client {name}. KYC follow-up task created."
3. Add notification for Manager: "Sales {username} claimed client {name}"

### Workflow 2: Client Status Lifecycle

**Trigger:** `client.statusChanged`
**Handler (by target status):**
- → `registered`: Create task `kyc_followup` for assigned Sales
- → `kyc_pending`: Notification to Sales "KYC submitted, awaiting review"
- → `kyc_approved`: Create task `deposit_guidance` for assigned Sales
- → `kyc_rejected`: Create task `kyc_rejected` for assigned Sales
- → `funded`: Create task `trade_activation` for assigned Sales
- → `active`: Notification to Manager "Client {name} is now active"
- → `dormant`: Create task `reactivation` for assigned Sales, notify Manager

Each transition generates a notification for the responsible Sales user.

**UI Enhancement:** Add "Simulate Status Change" dropdown button on ClientDetailPage that calls `clientStore.updateClientStatus(id, newStatus)` which emits `client.statusChanged`.

### Workflow 3: Task Chain Auto-Creation

**Trigger:** `task.statusChanged` where `to === 'completed'`
**Handler (by task type):**
- `kyc_followup` completed → if client status < `kyc_approved`, advance client to `kyc_pending`
- `deposit_guidance` completed → advance client to `funded`
- `trade_activation` completed → advance client to `active`
- `reactivation` completed → advance client from `dormant` to `active`

Client status advance emits `client.statusChanged`, which may create the next task in the chain (recursive through EventBus).

### Workflow 4: No-Response Retry

**Trigger:** `task.statusChanged` where `to === 'no_response'`
**Handler:**
1. Check `task.retryCount < 3`
2. If yes: Create new task (same type, same client, `retryCount + 1`, assigned to same user)
3. Add notification: "Task retry #{retryCount+1} created for client {name}"
4. If no (retryCount >= 3): Mark as failed, notify Manager "Task for client {name} failed after 3 retries"

### Workflow 5: Ticket Escalation Effects

**Trigger:** `ticket.escalated`
**Handler:**
1. If escalation type is `submit_to_manager`:
   - Notify all Manager users: "Ticket #{id} escalated: {reason}"
2. If escalation type is `forward_to_sales`:
   - Find client's assigned Sales, reassign ticket to them
   - Notify Sales: "Ticket #{id} forwarded to you"

**UI Enhancement:** In `TicketDetailDrawer`, when ticket is `on_hold` and current user is Manager:
- Show "Return to Processing" button (→ `in_progress`)
- Show "Resolve" button (→ `resolved`)
- Show "Close" button (→ `closed`)

### Workflow 6: IB Approval Effects

**Trigger:** `ib.approved`
**Handler:**
1. Look up IBDeal, find client
2. Update client's `ibInfo`: `{ isIB: true, ibCode: 'IB-{id}' }`
3. Notify creator (Sales): "IB Deal for {clientName} has been approved"

**Trigger:** `ib.rejected`
**Handler:**
1. Notify creator: "IB Deal for {clientName} was rejected. Reason: {reason}"

**Trigger:** `ib.resubmitted`
**Handler:**
1. Notify all Manager users: "IB Deal for {clientName} has been resubmitted for approval"

### Workflow 7: IB Expiration

**Trigger:** `ib.expired` (from simulated button in IBDealDetailDrawer)
**Handler:**
1. Create task: `ib_renewal_followup` for the deal's creator
2. Notify Manager + Sales: "IB Deal for {clientName} has expired"

### Workflow 8: Automation Engine (Simplified)

**Trigger:** Any event in EventBus
**Handler:**
1. Get all enabled rules from AutomationStore
2. For each rule, evaluate conditions against event data:
   - Simple field matching: `event.clientStatus === condition.value`
   - Support AND logic within condition groups
3. If conditions match, execute actions:
   - `create_task`: Call TaskStore.createTask()
   - `notify_manager`: Call NotificationStore.addNotification()
   - `assign_to_group`: Look up group members, assign by least-load
   - `update_status`: Call ClientStore.updateClient()
4. Log execution in a new `automationLogStore` (or append to rule object)

**UI Enhancement:** AutomationPage adds "Execution Log" tab showing recent rule executions with timestamp, rule name, event, result.

### Workflow 9: Notification System

**Enhancement to NotificationStore:**
```typescript
addNotification: (params: { type, title, description, link? }) => void
```

All workflows above call this. Notifications appear in:
- Header bell icon (unreadCount updates in real-time)
- NotificationPanel popover (clicking bell)
- Each notification clickable → navigates to `link`

**UI Enhancement:** Build NotificationPanel as a Popover triggered by bell icon in Header. List all notifications with read/unread styling, "Mark all as read" button.

### Workflow 10: Communication → Ticket Creation

**Trigger:** Support clicks "Create Ticket" in ChatArea
**Handler:**
1. Create ticket: `{ source: 'internal_created', category: 'general', clientId, content, assignedTo: currentUser.id }`
2. Emit `ticket.created`
3. Notify Support: "Ticket created for {clientName}"

### Workflow 11: User Status → Task Reassignment

**Trigger:** Manager changes user status to `offline` on TeamMembersPage
**Handler:**
1. Count user's in-progress tasks
2. If count > 0: Show confirmation dialog "This user has {N} tasks. Return to pool?"
3. If confirmed: Call `taskStore.returnTask()` for each task
4. Notify Manager: "{userName} went offline. {N} tasks returned to pool."

### Workflow 12: CRM Event Simulator Panel

**New Component:** `src/components/layout/EventSimulator.tsx`
**Location:** Button in Header (only visible in demo, perhaps with a "lightning bolt" icon)
**UI:**
- Dialog/Popover with:
  - Client selector dropdown
  - Event type dropdown: registered, kyc_approved, kyc_rejected, funded, traded, ticket_created
  - "Fire Event" button
- On fire: emits the corresponding `crm.*` event on EventBus
- WorkflowEngine handles `crm.*` events by:
  1. Updating client status
  2. Which cascades through all the above workflows

This is the key demo feature — allows presenter to show the entire automation chain in real-time.

---

## Store Modifications Summary

| Store | Changes |
|-------|---------|
| `auth-store` | No changes |
| `client-store` | Add `updateClientStatus(id, status)` which emits `client.statusChanged`. Modify `claimClient`/`releaseClient` to emit events. |
| `task-store` | Modify `claimTask`, `returnTask`, `updateTaskStatus`, `createTask` to emit events. |
| `ticket-store` | Modify `createTicket`, `updateTicketStatus`, `escalateTicket` to emit events. |
| `ib-store` | Modify `createIBDeal`, `approveIBDeal`, `rejectIBDeal`, `resubmitIBDeal` to emit events. Add `expireIBDeal`. |
| `notification-store` | Add `addNotification(params)`. |
| `automation-store` | Add `executionLog: AutomationLogEntry[]` and `addLogEntry()`. Modify `toggleRule` to emit. |
| `team-store` | No changes (user status is in mock data) |

## UI Modifications Summary

| Page/Component | Changes |
|----------------|---------|
| `Header.tsx` | Add EventSimulator button, build NotificationPanel popover on bell |
| `ClientDetailPage.tsx` | Add "Simulate Status Change" button/dropdown |
| `TicketDetailDrawer.tsx` | Allow Manager actions on `on_hold` tickets |
| `IBDealDetailDrawer.tsx` | Add "Simulate Expiration" button |
| `AutomationPage.tsx` | Add "Execution Log" tab |
| `TeamMembersPage.tsx` | Add status toggle with task reassignment confirmation |
| `ChatArea.tsx` | Wire up "Create Ticket" button |

## New Files

| File | Purpose |
|------|---------|
| `src/lib/event-bus.ts` | Typed EventBus (pub/sub) |
| `src/lib/workflow-engine.ts` | Central workflow handler |
| `src/components/layout/EventSimulator.tsx` | CRM event simulation panel |
| `src/components/layout/NotificationPanel.tsx` | Notification list popover |
