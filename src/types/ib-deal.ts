export type CommissionType = 'per_lot' | 'percentage' | 'fixed'

export type PaymentFrequency = 'one_time' | 'monthly' | 'quarterly'

export type IBDealStatus =
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'expired'

export interface ApprovalHistoryEntry {
  id: string
  action: 'created' | 'submitted' | 'approved' | 'rejected' | 'modified'
  actor: string
  timestamp: string
  reason?: string
  statusChange?: { from: IBDealStatus; to: IBDealStatus }
}

export interface IBDeal {
  id: string
  clientId: string
  createdBy: string
  commissionRate: number
  commissionType: CommissionType
  monthlyTarget: string
  effectiveDate: string
  expiryDate?: string
  extraPayment?: number
  paymentFrequency?: PaymentFrequency
  notes?: string
  status: IBDealStatus
  createdAt: string
  approvalHistory: ApprovalHistoryEntry[]
}
