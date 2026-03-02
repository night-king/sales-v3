import type { Priority, CommunicationLog } from './common'

export type TaskType =
  | 'kyc_followup'
  | 'kyc_rejected'
  | 'deposit_guidance'
  | 'trade_activation'
  | 'reactivation'
  | 'negative_balance_resolution'
  | 'withdrawal_feedback'
  | 'event_notification'
  | 'ib_renewal_followup'

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'no_response'

export interface Task {
  id: string
  type: TaskType
  priority: Priority
  status: TaskStatus
  clientId: string
  createdBy: string
  assignedTo?: string
  createdAt: string
  dueDate?: string
  nextFollowUp?: string
  retryCount: number
  maxRetries: number
  description?: string
  communicationLogs: CommunicationLog[]
}
