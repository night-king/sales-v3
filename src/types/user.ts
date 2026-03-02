import type { Role, UserStatus, Language, Region } from './common'

export type SkillTag =
  | 'lead_conversion'
  | 'kyc_assistance'
  | 'deposit_activation'
  | 'first_trade_onboarding'
  | 'reactivation_retention'
  | 'ib_deal_negotiation'
  | 'ib_renewal'
  | 'vip_account_management'
  | 'mt4_mt5_support'
  | 'deposit_withdrawal_support'
  | 'trade_issue_resolution'
  | 'account_security'
  | 'complaint_handling'
  | 'compliance_risk'

export interface User {
  id: string
  name: string
  username: string
  email: string
  role: Role
  status: UserStatus
  languages: Language[]
  regions: Region[]
  maxTaskCapacity: number
  skills: SkillTag[]
  avatar?: string
}
