import type { Priority, Channel } from './common'

export type TicketSource = 'crm_issue' | 'internal_created'

export type TicketCategory =
  | 'general'
  | 'account'
  | 'ib_application'
  | 'kyc'
  | 'deposit'
  | 'withdrawal'
  | 'trading'
  | 'technical'
  | 'complaint'

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'on_hold'
  | 'resolved'
  | 'closed'

export type EscalationType = 'submit_to_manager' | 'forward_to_sales'

export interface EscalationRecord {
  id: string
  type: EscalationType
  priority: Priority
  reason: string
  notes?: string
  createdBy: string
  createdAt: string
}

export interface TicketHistoryEntry {
  id: string
  action: string
  actor: string
  timestamp: string
  details?: string
}

export interface Ticket {
  id: string
  source: TicketSource
  channel: Channel
  category: TicketCategory
  priority: Priority
  status: TicketStatus
  content: string
  clientId: string
  createdBy: string
  assignedTo?: string
  createdAt: string
  crmIssueId?: string
  escalationHistory: EscalationRecord[]
  history: TicketHistoryEntry[]
}
