import { eventBus } from './event-bus'
import { useClientStore } from '@/store/client-store'
import { useTaskStore } from '@/store/task-store'
import { useTicketStore } from '@/store/ticket-store'
import { useIBStore } from '@/store/ib-store'
import { useNotificationStore } from '@/store/notification-store'
import { mockUsers } from '@/data/users'
import type { TaskType } from '@/types/task'
import type { ClientStatus } from '@/types/client'

// --- Helpers ---

function createWorkflowTask(params: {
  type: TaskType
  clientId: string
  assignedTo?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string
  retryCount?: number
}) {
  const task = {
    id: `task-wf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: params.type,
    status: 'pending' as const,
    priority: params.priority,
    clientId: params.clientId,
    assignedTo: params.assignedTo,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    description: params.description,
    retryCount: params.retryCount ?? 0,
    maxRetries: 3,
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

// --- Workflow 1: Client Claim Cascade ---

function handleClientClaimed({ clientId, userId }: { clientId: string; userId: string }) {
  const name = getClientName(clientId)
  createWorkflowTask({
    type: 'kyc_followup',
    clientId,
    assignedTo: userId,
    priority: 'medium',
    description: `Follow up with ${name} for KYC document submission.`,
  })
  notify('client', 'Client Claimed', `You claimed client ${name}. KYC follow-up task created.`, `/client/${clientId}`)
}

// --- Workflow 2: Client Status Lifecycle ---

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

  const taskConfig = TASK_FOR_STATUS[to]
  if (taskConfig && assignee) {
    createWorkflowTask({
      type: taskConfig.type,
      clientId,
      assignedTo: assignee,
      priority: taskConfig.priority,
      description: `${taskConfig.desc} for ${name}.`,
    })
  }

  notify('client', 'Client Status Changed', `${name}: ${from} \u2192 ${to}`, `/client/${clientId}`)
}

// --- Workflow 3: Task Chain (task completed -> advance client) ---

const CLIENT_ADVANCE: Partial<Record<TaskType, ClientStatus>> = {
  kyc_followup: 'kyc_pending',
  deposit_guidance: 'funded',
  trade_activation: 'active',
  reactivation: 'active',
}

function handleTaskStatusChanged({ taskId: _taskId, from: _from, to, task }: { taskId: string; from: string; to: string; task: any }) {
  const clientName = getClientName(task.clientId)

  if (to === 'completed') {
    const nextStatus = CLIENT_ADVANCE[task.type as TaskType]
    if (nextStatus) {
      useClientStore.getState().updateClientStatus(task.clientId, nextStatus)
    }
    notify('task', 'Task Completed', `Task "${task.type}" for ${clientName} completed.`, `/task/my-tasks`)
  }

  if (to === 'no_response') {
    handleNoResponseRetry(task)
  }

  if (to === 'failed') {
    notify('task', 'Task Failed', `Task "${task.type}" for ${clientName} has failed.`, `/task/my-tasks`)
  }
}

// --- Workflow 4: No-Response Retry ---

function handleNoResponseRetry(task: any) {
  const clientName = getClientName(task.clientId)
  if (task.retryCount < 3) {
    createWorkflowTask({
      type: task.type,
      clientId: task.clientId,
      assignedTo: task.assignedTo,
      priority: task.priority,
      description: `Retry #${task.retryCount + 1}: ${task.description ?? ''}`,
      retryCount: task.retryCount + 1,
    })
    notify('task', 'Retry Task Created', `Retry #${task.retryCount + 1} for ${clientName}`, `/task/my-tasks`)
  } else {
    notify('task', 'Task Failed (Max Retries)', `Task for ${clientName} failed after 3 retries.`, `/task/all`)
  }
}

// --- Workflow 5: Ticket Escalation ---

function handleTicketEscalated({ ticketId, escalation }: { ticketId: string; escalation: any }) {
  const ticket = useTicketStore.getState().tickets.find((t) => t.id === ticketId)
  if (!ticket) return
  const clientName = getClientName(ticket.clientId)

  if (escalation.type === 'submit_to_manager') {
    notify('ticket', 'Ticket Escalated to Manager', `Ticket for ${clientName} escalated: ${escalation.reason}`, `/ticket/all`)
  } else if (escalation.type === 'forward_to_sales') {
    const client = useClientStore.getState().clients.find((c) => c.id === ticket.clientId)
    if (client?.assignedTo) {
      useTicketStore.getState().assignTicket(ticketId, client.assignedTo)
      notify('ticket', 'Ticket Forwarded', `Ticket for ${clientName} forwarded to ${getUserName(client.assignedTo)}`, `/ticket/my-tickets`)
    }
  }
}

// --- Workflow 6: IB Approval/Rejection ---

function handleIBApproved({ dealId, actor }: { dealId: string; actor: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  const clientName = getClientName(deal.clientId)
  useClientStore.getState().updateClient(deal.clientId, {
    ibInfo: { isIB: true, ibCode: `IB-${dealId.slice(-4)}`, ibLevel: 'Standard' },
  })
  notify('ib', 'IB Deal Approved', `IB Deal for ${clientName} has been approved by ${getUserName(actor)}`, `/ib/my-deals`)
}

function handleIBRejected({ dealId, reason }: { dealId: string; actor: string; reason: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  const clientName = getClientName(deal.clientId)
  notify('ib', 'IB Deal Rejected', `IB Deal for ${clientName} rejected: ${reason}`, `/ib/my-deals`)
}

function handleIBResubmitted({ dealId }: { dealId: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  const clientName = getClientName(deal.clientId)
  notify('ib', 'IB Deal Resubmitted', `IB Deal for ${clientName} has been resubmitted for approval`, `/ib/pending`)
}

// --- Workflow 7: IB Expiration ---

function handleIBExpired({ dealId }: { dealId: string }) {
  const deal = useIBStore.getState().ibDeals.find((d) => d.id === dealId)
  if (!deal) return
  const clientName = getClientName(deal.clientId)
  createWorkflowTask({
    type: 'ib_renewal_followup',
    clientId: deal.clientId,
    assignedTo: deal.createdBy,
    priority: 'high',
    description: `IB Deal for ${clientName} has expired. Discuss renewal terms.`,
  })
  notify('ib', 'IB Deal Expired', `IB Deal for ${clientName} has expired. Renewal task created.`, `/ib/all`)
}

// --- CRM Event Handlers ---

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
  }
}

// --- Init ---

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
  console.log('[WorkflowEngine] Initialized with all workflow handlers')
}
