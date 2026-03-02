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
