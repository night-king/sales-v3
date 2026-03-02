# Workflow Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire up 12 cross-module workflows so the frontend demo behaves like a real event-driven system — actions cascade across modules with notifications, task chains, and automation.

**Architecture:** Typed EventBus (pub/sub) + central WorkflowEngine listener + enhanced Zustand stores that emit events after mutations. No new dependencies needed.

**Tech Stack:** TypeScript, Zustand (existing), React (existing), shadcn/ui (existing)

---

## Task 1: EventBus

**Files:**
- Create: `src/lib/event-bus.ts`

**Step 1: Create the typed EventBus**

```typescript
import type { ClientStatus } from '@/types/client'
import type { Task, TaskStatus } from '@/types/task'
import type { Ticket, TicketStatus, EscalationRecord } from '@/types/ticket'
import type { IBDeal } from '@/types/ib-deal'

export type EventMap = {
  'client.claimed': { clientId: string; userId: string }
  'client.released': { clientId: string }
  'client.statusChanged': { clientId: string; from: ClientStatus; to: ClientStatus }
  'task.created': { task: Task }
  'task.statusChanged': { taskId: string; from: TaskStatus; to: TaskStatus; task: Task }
  'task.claimed': { taskId: string; userId: string }
  'task.returned': { taskId: string }
  'ticket.created': { ticket: Ticket }
  'ticket.statusChanged': { ticketId: string; from: TicketStatus; to: TicketStatus }
  'ticket.escalated': { ticketId: string; escalation: EscalationRecord }
  'ib.created': { deal: IBDeal }
  'ib.approved': { dealId: string; actor: string }
  'ib.rejected': { dealId: string; actor: string; reason: string }
  'ib.resubmitted': { dealId: string }
  'ib.expired': { dealId: string }
  'automation.ruleToggled': { ruleId: string; enabled: boolean }
  'crm.clientRegistered': { clientId: string }
  'crm.kycApproved': { clientId: string }
  'crm.kycRejected': { clientId: string }
  'crm.clientFunded': { clientId: string }
  'crm.clientTraded': { clientId: string }
  'crm.ticketCreated': { clientId: string; category: string }
}

type EventHandler<K extends keyof EventMap> = (data: EventMap[K]) => void

class EventBus {
  private handlers = new Map<string, Set<Function>>()

  on<K extends keyof EventMap>(event: K, handler: EventHandler<K>) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(handler)
    return () => this.handlers.get(event)?.delete(handler)
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.handlers.get(event)?.forEach((handler) => {
      try { handler(data) } catch (e) { console.error(`[EventBus] Error in ${event} handler:`, e) }
    })
  }
}

export const eventBus = new EventBus()
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/lib/event-bus.ts
git commit -m "feat: add typed EventBus for cross-module event system"
```

---

## Task 2: Enhance NotificationStore

**Files:**
- Modify: `src/store/notification-store.ts`

**Step 1: Add `addNotification` action**

Add to the `NotificationState` interface: `addNotification: (params: { type: Notification['type']; title: string; description: string; link?: string }) => void`

Add implementation that creates a new `Notification` with auto-generated id, current timestamp, `read: false`, then prepends to array and increments unreadCount.

The full rewritten file:

```typescript
import { create } from 'zustand'
import type { Notification } from '@/types/common'
import { mockNotifications } from '@/data/notifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (params: { type: Notification['type']; title: string; description: string; link?: string }) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [...mockNotifications],
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  addNotification: (params) =>
    set((state) => {
      const notification: Notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...params,
        timestamp: new Date().toISOString(),
        read: false,
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }
    }),

  markAsRead: (notificationId) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}))
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/store/notification-store.ts
git commit -m "feat: add addNotification action to NotificationStore"
```

---

## Task 3: Add event emissions to all stores

**Files:**
- Modify: `src/store/client-store.ts`
- Modify: `src/store/task-store.ts`
- Modify: `src/store/ticket-store.ts`
- Modify: `src/store/ib-store.ts`
- Modify: `src/store/automation-store.ts`

**Step 1: Modify client-store.ts**

Add `import { eventBus } from '@/lib/event-bus'` and `import type { ClientStatus } from '@/types/client'`.

Add new action `updateClientStatus(clientId, status)` that updates the status AND emits `client.statusChanged`.

Modify `claimClient` to emit `client.claimed` after set().
Modify `releaseClient` to emit `client.released` after set().

Key pattern — use `get()` from zustand to read state after mutation:

```typescript
import { create } from 'zustand'
import type { Client, ClientStatus } from '@/types/client'
import { mockClients } from '@/data/clients'
import { eventBus } from '@/lib/event-bus'

interface ClientState {
  clients: Client[]
  claimClient: (clientId: string, userId: string) => void
  releaseClient: (clientId: string) => void
  updateClient: (clientId: string, updates: Partial<Client>) => void
  updateClientStatus: (clientId: string, status: ClientStatus) => void
  addClient: (client: Client) => void
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [...mockClients],

  claimClient: (clientId, userId) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, assignedTo: userId } : c
      ),
    }))
    eventBus.emit('client.claimed', { clientId, userId })
  },

  releaseClient: (clientId) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, assignedTo: undefined, status: 'lead' } : c
      ),
    }))
    eventBus.emit('client.released', { clientId })
  },

  updateClient: (clientId, updates) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, ...updates } : c
      ),
    })),

  updateClientStatus: (clientId, status) => {
    const client = get().clients.find((c) => c.id === clientId)
    const from = client?.status ?? 'lead'
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, status } : c
      ),
    }))
    if (from !== status) {
      eventBus.emit('client.statusChanged', { clientId, from, to: status })
    }
  },

  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),
}))
```

**Step 2: Modify task-store.ts**

Add `import { eventBus } from '@/lib/event-bus'`.

Modify `updateTaskStatus` to capture `from` status before mutation and emit `task.statusChanged` after.
Modify `createTask` to emit `task.created`.
Modify `claimTask` to emit `task.claimed`.
Modify `returnTask` to emit `task.returned`.

```typescript
import { create } from 'zustand'
import type { Task, TaskStatus } from '@/types/task'
import { mockTasks } from '@/data/tasks'
import { eventBus } from '@/lib/event-bus'

interface TaskState {
  tasks: Task[]
  claimTask: (taskId: string, userId: string) => void
  returnTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  assignTask: (taskId: string, userId: string) => void
  createTask: (task: Task) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [...mockTasks],

  claimTask: (taskId, userId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: userId, status: 'in_progress' as TaskStatus } : t
      ),
    }))
    eventBus.emit('task.claimed', { taskId, userId })
  },

  returnTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: undefined, status: 'pending' as TaskStatus } : t
      ),
    }))
    eventBus.emit('task.returned', { taskId })
  },

  updateTaskStatus: (taskId, status) => {
    const task = get().tasks.find((t) => t.id === taskId)
    const from = task?.status ?? 'pending'
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    }))
    if (task && from !== status) {
      const updated = get().tasks.find((t) => t.id === taskId)!
      eventBus.emit('task.statusChanged', { taskId, from, to: status, task: updated })
    }
  },

  assignTask: (taskId, userId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: userId } : t
      ),
    })),

  createTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }))
    eventBus.emit('task.created', { task })
  },
}))
```

**Step 3: Modify ticket-store.ts**

Add event emissions for `createTicket`, `updateTicketStatus`, `escalateTicket`.

```typescript
import { create } from 'zustand'
import type { Ticket, TicketStatus, EscalationRecord } from '@/types/ticket'
import { mockTickets } from '@/data/tickets'
import { eventBus } from '@/lib/event-bus'

interface TicketState {
  tickets: Ticket[]
  createTicket: (ticket: Ticket) => void
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void
  escalateTicket: (ticketId: string, escalation: EscalationRecord) => void
  assignTicket: (ticketId: string, userId: string) => void
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [...mockTickets],

  createTicket: (ticket) => {
    set((state) => ({ tickets: [ticket, ...state.tickets] }))
    eventBus.emit('ticket.created', { ticket })
  },

  updateTicketStatus: (ticketId, status) => {
    const ticket = get().tickets.find((t) => t.id === ticketId)
    const from = ticket?.status ?? 'open'
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status } : t
      ),
    }))
    if (from !== status) {
      eventBus.emit('ticket.statusChanged', { ticketId, from, to: status })
    }
  },

  escalateTicket: (ticketId, escalation) => {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'on_hold' as TicketStatus,
              escalationHistory: [...t.escalationHistory, escalation],
            }
          : t
      ),
    }))
    eventBus.emit('ticket.escalated', { ticketId, escalation })
  },

  assignTicket: (ticketId, userId) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: userId } : t
      ),
    })),
}))
```

**Step 4: Modify ib-store.ts**

Add event emissions for `createIBDeal`, `approveIBDeal`, `rejectIBDeal`, `resubmitIBDeal`. Add new `expireIBDeal` action.

Add `import { eventBus } from '@/lib/event-bus'` at top.

After each set() call, add the corresponding eventBus.emit(). For `approveIBDeal`, after the set, add: `eventBus.emit('ib.approved', { dealId, actor })`. For `rejectIBDeal`: `eventBus.emit('ib.rejected', { dealId, actor, reason })`. For `resubmitIBDeal`: `eventBus.emit('ib.resubmitted', { dealId })`. For `createIBDeal`: `eventBus.emit('ib.created', { deal })`.

Add new action `expireIBDeal(dealId)` which transitions status to `'expired'` and emits `ib.expired`.

**Step 5: Modify automation-store.ts**

Add `import { eventBus } from '@/lib/event-bus'`.

Add `executionLog` state array and `addLogEntry` action. Modify `toggleRule` to emit `automation.ruleToggled`.

Add to interface:
```typescript
executionLog: { id: string; ruleId: string; ruleName: string; event: string; result: 'success' | 'skipped'; timestamp: string }[]
addLogEntry: (entry: AutomationState['executionLog'][0]) => void
```

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add src/store/client-store.ts src/store/task-store.ts src/store/ticket-store.ts src/store/ib-store.ts src/store/automation-store.ts
git commit -m "feat: add event emissions to all Zustand stores"
```

---

## Task 4: WorkflowEngine — core handlers

**Files:**
- Create: `src/lib/workflow-engine.ts`
- Modify: `src/main.tsx`

**Step 1: Create workflow-engine.ts**

This is the central handler. It imports all stores via `getState()` pattern (not hooks — this runs outside React):

```typescript
import { eventBus } from './event-bus'
import { useClientStore } from '@/store/client-store'
import { useTaskStore } from '@/store/task-store'
import { useTicketStore } from '@/store/ticket-store'
import { useIBStore } from '@/store/ib-store'
import { useNotificationStore } from '@/store/notification-store'
import { useAutomationStore } from '@/store/automation-store'
import { mockUsers } from '@/data/users'
import type { TaskType } from '@/types/task'
import type { ClientStatus } from '@/types/client'
```

Helper to create a task:
```typescript
function createWorkflowTask(params: {
  type: TaskType; clientId: string; clientName: string;
  assignedTo?: string; priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string; retryCount?: number;
}) {
  const task = {
    id: `task-wf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: params.type,
    status: 'pending' as const,
    priority: params.priority,
    clientId: params.clientId,
    clientName: params.clientName,
    assignedTo: params.assignedTo,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    description: params.description,
    retryCount: params.retryCount ?? 0,
    communicationLogs: [],
    createdAt: new Date().toISOString(),
    createdBy: 'system',
  }
  useTaskStore.getState().createTask(task)
  return task
}

function notify(type: 'task' | 'ticket' | 'ib' | 'client' | 'system', title: string, description: string, link?: string) {
  useNotificationStore.getState().addNotification({ type, title, description, link })
}

function getClientName(clientId: string): string {
  return useClientStore.getState().clients.find((c) => c.id === clientId)?.name ?? clientId
}

function getUserName(userId: string): string {
  return mockUsers.find((u) => u.id === userId)?.name ?? userId
}
```

**Workflow 1: Client Claim Cascade**
```typescript
function handleClientClaimed({ clientId, userId }: { clientId: string; userId: string }) {
  const name = getClientName(clientId)
  createWorkflowTask({
    type: 'kyc_followup', clientId, clientName: name,
    assignedTo: userId, priority: 'medium',
    description: `Follow up with ${name} for KYC document submission.`,
  })
  notify('client', 'Client Claimed', `You claimed client ${name}. KYC follow-up task created.`, `/client/${clientId}`)
}
```

**Workflow 2: Client Status Lifecycle**
```typescript
const TASK_FOR_STATUS: Partial<Record<ClientStatus, { type: TaskType; desc: string; priority: 'medium' | 'high' }>> = {
  registered: { type: 'kyc_followup', desc: 'Guide client through KYC submission', priority: 'medium' },
  kyc_approved: { type: 'deposit_guidance', desc: 'Guide client through first deposit', priority: 'high' },
  kyc_rejected: { type: 'kyc_rejected', desc: 'Help client resubmit KYC documents', priority: 'high' },
  funded: { type: 'trade_activation', desc: 'Help client complete first trade', priority: 'medium' },
  dormant: { type: 'reactivation', desc: 'Re-engage dormant client', priority: 'medium' },
}

function handleClientStatusChanged({ clientId, from, to }: { clientId: string; from: ClientStatus; to: ClientStatus }) {
  const client = useClientStore.getState().clients.find((c) => c.id === clientId)
  if (!client) return
  const name = client.name
  const assignee = client.assignedTo

  // Create task if mapping exists
  const taskConfig = TASK_FOR_STATUS[to]
  if (taskConfig && assignee) {
    createWorkflowTask({
      type: taskConfig.type, clientId, clientName: name,
      assignedTo: assignee, priority: taskConfig.priority,
      description: `${taskConfig.desc} for ${name}.`,
    })
  }

  // Notify
  notify('client', 'Client Status Changed', `${name}: ${from} → ${to}`, `/client/${clientId}`)
}
```

**Workflow 3: Task Chain (task completed → advance client)**
```typescript
const CLIENT_ADVANCE: Partial<Record<TaskType, ClientStatus>> = {
  kyc_followup: 'kyc_pending',
  deposit_guidance: 'funded',
  trade_activation: 'active',
  reactivation: 'active',
}

function handleTaskStatusChanged({ taskId, from, to, task }: { taskId: string; from: string; to: string; task: any }) {
  if (to === 'completed') {
    const nextStatus = CLIENT_ADVANCE[task.type as TaskType]
    if (nextStatus) {
      useClientStore.getState().updateClientStatus(task.clientId, nextStatus)
      // This will emit client.statusChanged, which triggers Workflow 2 (recursive chain)
    }
    notify('task', 'Task Completed', `Task "${task.type}" for ${task.clientName} completed.`, `/task/my-tasks`)
  }

  // Workflow 4: No-Response Retry
  if (to === 'no_response') {
    handleNoResponseRetry(task)
  }

  if (to === 'failed') {
    notify('task', 'Task Failed', `Task "${task.type}" for ${task.clientName} has failed.`, `/task/my-tasks`)
  }
}
```

**Workflow 4: No-Response Retry**
```typescript
function handleNoResponseRetry(task: any) {
  if (task.retryCount < 3) {
    createWorkflowTask({
      type: task.type, clientId: task.clientId, clientName: task.clientName,
      assignedTo: task.assignedTo, priority: task.priority,
      description: `Retry #${task.retryCount + 1}: ${task.description}`,
      retryCount: task.retryCount + 1,
    })
    notify('task', 'Retry Task Created', `Retry #${task.retryCount + 1} for ${task.clientName}`, `/task/my-tasks`)
  } else {
    notify('task', 'Task Failed (Max Retries)', `Task for ${task.clientName} failed after 3 retries.`, `/task/all`)
  }
}
```

**Workflow 5: Ticket Escalation**
```typescript
function handleTicketEscalated({ ticketId, escalation }: { ticketId: string; escalation: any }) {
  const ticket = useTicketStore.getState().tickets.find((t) => t.id === ticketId)
  if (!ticket) return

  if (escalation.type === 'submit_to_manager') {
    notify('ticket', 'Ticket Escalated to Manager', `Ticket for ${ticket.clientName} escalated: ${escalation.reason}`, `/ticket/all`)
  } else if (escalation.type === 'forward_to_sales') {
    const client = useClientStore.getState().clients.find((c) => c.id === ticket.clientId)
    if (client?.assignedTo) {
      useTicketStore.getState().assignTicket(ticketId, client.assignedTo)
      notify('ticket', 'Ticket Forwarded', `Ticket for ${ticket.clientName} forwarded to ${getUserName(client.assignedTo)}`, `/ticket/my-tickets`)
    }
  }
}
```

**Workflow 6: IB Approval/Rejection**
```typescript
function handleIBApproved({ dealId, actor }: { dealId: string; actor: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  // Update client's IB info
  useClientStore.getState().updateClient(deal.clientId, {
    ibInfo: { isIB: true, ibCode: `IB-${dealId.slice(-4)}`, ibLevel: 'Standard' },
  })
  notify('ib', 'IB Deal Approved', `IB Deal for ${deal.clientName} has been approved by ${getUserName(actor)}`, `/ib/my-deals`)
}

function handleIBRejected({ dealId, reason }: { dealId: string; actor: string; reason: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  notify('ib', 'IB Deal Rejected', `IB Deal for ${deal.clientName} rejected: ${reason}`, `/ib/my-deals`)
}

function handleIBResubmitted({ dealId }: { dealId: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  notify('ib', 'IB Deal Resubmitted', `IB Deal for ${deal.clientName} has been resubmitted for approval`, `/ib/pending`)
}
```

**Workflow 7: IB Expiration**
```typescript
function handleIBExpired({ dealId }: { dealId: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  createWorkflowTask({
    type: 'ib_renewal_followup', clientId: deal.clientId, clientName: deal.clientName,
    assignedTo: deal.createdBy, priority: 'high',
    description: `IB Deal for ${deal.clientName} has expired. Discuss renewal terms.`,
  })
  notify('ib', 'IB Deal Expired', `IB Deal for ${deal.clientName} has expired. Renewal task created.`, `/ib/all`)
}
```

**CRM Event Handlers (Workflow 12 support)**
```typescript
function handleCRMEvent(eventType: string, clientId: string) {
  const statusMap: Record<string, ClientStatus> = {
    'crm.clientRegistered': 'registered',
    'crm.kycApproved': 'kyc_approved',
    'crm.kycRejected': 'kyc_rejected',
    'crm.clientFunded': 'funded',
    'crm.clientTraded': 'active',
  }
  const newStatus = statusMap[eventType]
  if (newStatus) {
    useClientStore.getState().updateClientStatus(clientId, newStatus)
    // This cascades through client.statusChanged handler above
  }
}
```

**Init function**
```typescript
export function initWorkflowEngine() {
  eventBus.on('client.claimed', handleClientClaimed)
  eventBus.on('client.statusChanged', handleClientStatusChanged)
  eventBus.on('task.statusChanged', handleTaskStatusChanged)
  eventBus.on('ticket.escalated', handleTicketEscalated)
  eventBus.on('ib.approved', handleIBApproved)
  eventBus.on('ib.rejected', handleIBRejected)
  eventBus.on('ib.resubmitted', handleIBResubmitted)
  eventBus.on('ib.expired', handleIBExpired)
  // CRM events
  eventBus.on('crm.clientRegistered', ({ clientId }) => handleCRMEvent('crm.clientRegistered', clientId))
  eventBus.on('crm.kycApproved', ({ clientId }) => handleCRMEvent('crm.kycApproved', clientId))
  eventBus.on('crm.kycRejected', ({ clientId }) => handleCRMEvent('crm.kycRejected', clientId))
  eventBus.on('crm.clientFunded', ({ clientId }) => handleCRMEvent('crm.clientFunded', clientId))
  eventBus.on('crm.clientTraded', ({ clientId }) => handleCRMEvent('crm.clientTraded', clientId))
}
```

**Step 2: Wire up in main.tsx**

Add `import { initWorkflowEngine } from '@/lib/workflow-engine'` and call `initWorkflowEngine()` before `createRoot`.

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add src/lib/workflow-engine.ts src/main.tsx
git commit -m "feat: add WorkflowEngine with 7 core workflow handlers"
```

---

## Task 5: NotificationPanel UI

**Files:**
- Create: `src/components/layout/NotificationPanel.tsx`
- Modify: `src/components/layout/Header.tsx`

**Step 1: Create NotificationPanel**

A Popover component triggered by the bell icon in Header. Shows list of notifications with:
- Header: "Notifications" + "Mark all as read" button
- Scrollable list (max-h-96)
- Each notification: colored left border by type, title, description, relative timestamp, read/unread styling
- Click notification → markAsRead + navigate to link

Use: `Popover, PopoverContent, PopoverTrigger` from shadcn/ui, `ScrollArea`, `Button`, `useNotificationStore`, `useNavigate`.

**Step 2: Modify Header.tsx**

Replace the standalone bell `<Button>` (lines 73-84) with the `<NotificationPanel />` component. The panel handles its own bell icon and badge internally.

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add src/components/layout/NotificationPanel.tsx src/components/layout/Header.tsx
git commit -m "feat: add notification panel popover in header"
```

---

## Task 6: CRM Event Simulator

**Files:**
- Create: `src/components/layout/EventSimulator.tsx`
- Modify: `src/components/layout/Header.tsx`

**Step 1: Create EventSimulator**

A Dialog component with:
- Trigger: Button with Zap icon in header
- Content:
  - Client selector (Select from clientStore.clients)
  - Event type selector (Select: registered, kyc_approved, kyc_rejected, funded, traded)
  - "Fire Event" button
- On fire: call `eventBus.emit('crm.{eventType}', { clientId })` with the appropriate event name
- Show success toast/message after firing

Use: `Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger`, `Select`, `Button`, `eventBus`.

**Step 2: Add EventSimulator to Header**

Import and add the component next to the language toggle button in Header.

**Step 3: Verify**

```bash
npm run dev
```

Test: Open Event Simulator, select a client, fire "kyc_approved" event. Verify:
1. Client status changes in the store
2. A deposit_guidance task is auto-created
3. Notifications appear in the bell

**Step 4: Commit**

```bash
git add src/components/layout/EventSimulator.tsx src/components/layout/Header.tsx
git commit -m "feat: add CRM Event Simulator for workflow demonstration"
```

---

## Task 7: UI enhancements for Ticket escalation (Manager actions on on_hold)

**Files:**
- Modify: `src/pages/ticket/components/TicketDetailDrawer.tsx`

**Step 1: Update TicketDetailDrawer**

Find the section that handles `on_hold` status (currently shows only info text "Waiting for escalation response"). Add conditional logic: if `currentRole === 'manager'` AND `ticket.status === 'on_hold'`, show action buttons:
- "Return to Processing" → `updateTicketStatus(id, 'in_progress')`
- "Resolve" → `updateTicketStatus(id, 'resolved')`
- "Close" → `updateTicketStatus(id, 'closed')`

Import `useRole` hook from `@/hooks/use-role`.

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/ticket/components/TicketDetailDrawer.tsx
git commit -m "feat: allow Manager to handle on_hold tickets"
```

---

## Task 8: Client Detail — status simulation button

**Files:**
- Modify: `src/pages/client/ClientDetailPage.tsx`

**Step 1: Add status simulation UI**

In the client info card area, add a "Simulate Status Change" section:
- A Select dropdown showing valid next statuses for the current client status
- A "Apply" button that calls `clientStore.updateClientStatus(id, selectedStatus)`

Status transition map (valid next statuses):
- `lead` → `registered`
- `registered` → `kyc_pending`
- `kyc_pending` → `kyc_approved`, `kyc_rejected`
- `kyc_rejected` → `kyc_pending`
- `kyc_approved` → `funded`
- `funded` → `active`
- `active` → `dormant`
- `dormant` → `active`

Import `useClientStore` and the `updateClientStatus` action.

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/pages/client/ClientDetailPage.tsx
git commit -m "feat: add status simulation on client detail page"
```

---

## Task 9: IB Deal — expire simulation button

**Files:**
- Modify: `src/pages/ib/components/IBDealDetailDrawer.tsx`
- Modify: `src/store/ib-store.ts` (add expireIBDeal if not already done in Task 3)

**Step 1: Add expire button to IBDealDetailDrawer**

When deal status is `'active'` or `'approved'`, show a "Simulate Expiration" button at the bottom of the drawer. On click, call `ibStore.expireIBDeal(dealId)`.

**Step 2: Ensure `expireIBDeal` exists in ib-store**

If not already added in Task 3, add:
```typescript
expireIBDeal: (dealId) => {
  set((state) => ({
    ibDeals: state.ibDeals.map((d) =>
      d.id === dealId ? { ...d, status: 'expired' as IBDealStatus } : d
    ),
  }))
  eventBus.emit('ib.expired', { dealId })
}
```

**Step 3: Verify build and commit**

```bash
git add src/pages/ib/components/IBDealDetailDrawer.tsx src/store/ib-store.ts
git commit -m "feat: add IB deal expiration simulation"
```

---

## Task 10: Automation execution log UI

**Files:**
- Modify: `src/pages/automation/AutomationPage.tsx`

**Step 1: Add execution log display**

Add a section below the rules table (or as a Tab) showing `automationStore.executionLog`.

Display as a simple table: Timestamp, Rule Name, Event, Result (success/skipped badge).

If log is empty, show "No executions yet. Fire a CRM event to trigger automation rules."

**Step 2: Verify build and commit**

```bash
git add src/pages/automation/AutomationPage.tsx
git commit -m "feat: add automation execution log display"
```

---

## Task 11: Simplified automation engine in WorkflowEngine

**Files:**
- Modify: `src/lib/workflow-engine.ts`

**Step 1: Add automation evaluation**

Add a function `evaluateAutomationRules(eventType: string, eventData: Record<string, unknown>)` that:
1. Gets all enabled rules from `useAutomationStore.getState().rules`
2. For each rule, checks if `conditions[0].conditions` match (simplified: check `event.type` field matches eventType)
3. If matched, execute actions:
   - `create_task`: create a task using config
   - `notify_manager`: create a notification
   - `assign_to_group`: log only (group assignment is complex)
4. Log execution to `useAutomationStore.getState().addLogEntry()`

Call `evaluateAutomationRules()` at the end of each CRM event handler and task.statusChanged handler.

**Step 2: Verify**

Test: Enable "High Priority Task Notification" rule. Create a high-priority task. Verify automation log entry appears.

**Step 3: Commit**

```bash
git add src/lib/workflow-engine.ts
git commit -m "feat: add simplified automation rule evaluation in workflow engine"
```

---

## Task 12: Communication → Create Ticket wiring

**Files:**
- Modify: `src/pages/communication/components/ChatArea.tsx`
- Modify: `src/pages/communication/CommunicationPage.tsx`

**Step 1: Wire up "Create Ticket" button in ChatArea**

Add a "Create Ticket" button next to the Send button in the chat input area. On click:
1. Get the selected conversation's clientId
2. Call `ticketStore.createTicket()` with `source: 'internal_created'`, `category: 'general'`, content from last few messages
3. Show a brief success indicator

**Step 2: Verify and commit**

```bash
git add src/pages/communication/components/ChatArea.tsx src/pages/communication/CommunicationPage.tsx
git commit -m "feat: wire up Create Ticket from Communication Center"
```

---

## Task 13: Team Members — user status toggle with task reassignment

**Files:**
- Modify: `src/pages/team/TeamMembersPage.tsx`

**Step 1: Add status toggle**

In the team members table, add a clickable status indicator. When Manager clicks to set a user to "offline":
1. Check if the user has in-progress tasks (filter taskStore by assignedTo)
2. If yes, show a confirmation Dialog: "This user has {N} active tasks. Return them to the task pool?"
3. If confirmed, call `taskStore.returnTask()` for each task
4. Update the user's visual status (since we're using mock data, just toggle a local state or update via a simple map)
5. Generate notification

**Step 2: Verify and commit**

```bash
git add src/pages/team/TeamMembersPage.tsx
git commit -m "feat: add user status toggle with task reassignment on TeamMembersPage"
```

---

## Task 14: i18n keys for workflow notifications

**Files:**
- Modify: `src/i18n/en/common.json`
- Modify: `src/i18n/zh/common.json`

**Step 1: Add workflow-related i18n keys**

Add a `"workflow"` section to both EN and ZH common.json with keys for:
- Event simulator labels (event types, fire button, select client)
- Notification panel labels (title, mark all read, no notifications)
- Status simulation labels
- Automation log labels

**Step 2: Verify build and commit**

```bash
git add src/i18n/en/common.json src/i18n/zh/common.json
git commit -m "feat: add i18n keys for workflow features"
```

---

## Task 15: Final verification and integration test

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Full workflow smoke test**

Test the complete chain:
1. Login as Sales → claim a client from Public Pool → verify KYC task created + notification
2. Open Event Simulator → select that client → fire "kyc_approved" → verify deposit_guidance task created
3. Go to My Tasks → complete the deposit_guidance task → verify client status advances to "funded"
4. Login as Support → open Communication → send a message → create ticket → verify ticket in My Tickets
5. Escalate ticket → verify Manager notification
6. Switch to Manager → handle escalated ticket → verify resolution
7. Go to IB Pending → approve a deal → verify Sales notification + client IB info updated
8. Fire "traded" event → verify client becomes "active"
9. Check Automation page → verify execution log entries

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix: integration fixes for workflow engine"
```
