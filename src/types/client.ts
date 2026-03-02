import type { Language } from './common'

export type ClientStatus =
  | 'lead'
  | 'registered'
  | 'kyc_pending'
  | 'kyc_rejected'
  | 'kyc_approved'
  | 'funded'
  | 'active'
  | 'dormant'

export interface IBInfo {
  isIB: boolean
  ibCode?: string
  ibLevel?: string
  ibApplicationSummary?: string
}

export interface Client {
  id: string
  name: string
  country: string
  language: Language
  phone: string
  email: string
  cid?: string
  walletBalance: number
  mt5Balance: number
  registeredAt?: string
  lastActiveAt?: string
  assignedTo?: string // user id
  tags: string[]
  ibInfo?: IBInfo
  status: ClientStatus
  createdAt: string
  createdBy?: string // user id
}
