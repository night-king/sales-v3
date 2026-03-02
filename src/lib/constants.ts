import type { ClientStatus } from '@/types/client'
import type { TaskType, TaskStatus } from '@/types/task'
import type { TicketCategory, TicketStatus } from '@/types/ticket'
import type { IBDealStatus } from '@/types/ib-deal'
import type { Priority, UserStatus, Role, Region, Language, Channel } from '@/types/common'

// --- Client Statuses ---
export const CLIENT_STATUSES: { value: ClientStatus; labelEn: string; labelZh: string; color: string }[] = [
  { value: 'lead', labelEn: 'Lead', labelZh: '潜在客户', color: 'bg-gray-100 text-gray-800' },
  { value: 'registered', labelEn: 'Registered', labelZh: '已注册', color: 'bg-blue-100 text-blue-800' },
  { value: 'kyc_pending', labelEn: 'KYC Pending', labelZh: 'KYC审核中', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'kyc_rejected', labelEn: 'KYC Rejected', labelZh: 'KYC拒绝', color: 'bg-red-100 text-red-800' },
  { value: 'kyc_approved', labelEn: 'KYC Approved', labelZh: 'KYC通过', color: 'bg-green-100 text-green-800' },
  { value: 'funded', labelEn: 'Funded', labelZh: '已入金', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'active', labelEn: 'Active', labelZh: '活跃', color: 'bg-teal-100 text-teal-800' },
  { value: 'dormant', labelEn: 'Dormant', labelZh: '休眠', color: 'bg-orange-100 text-orange-800' },
]

// --- Task Types ---
export const TASK_TYPES: { value: TaskType; labelEn: string; labelZh: string }[] = [
  { value: 'kyc_followup', labelEn: 'KYC Follow-up', labelZh: 'KYC跟进' },
  { value: 'kyc_rejected', labelEn: 'KYC Resubmission', labelZh: 'KYC重提交' },
  { value: 'deposit_guidance', labelEn: 'Deposit Guidance', labelZh: '入金引导' },
  { value: 'trade_activation', labelEn: 'Trade Activation', labelZh: '交易激活' },
  { value: 'reactivation', labelEn: 'Reactivation', labelZh: '重新激活' },
  { value: 'negative_balance_resolution', labelEn: 'Negative Balance Resolution', labelZh: '负余额处理' },
  { value: 'withdrawal_feedback', labelEn: 'Withdrawal Feedback', labelZh: '出金反馈' },
  { value: 'event_notification', labelEn: 'Event Notification', labelZh: '活动通知' },
  { value: 'ib_renewal_followup', labelEn: 'IB Renewal Follow-up', labelZh: 'IB续签跟进' },
]

// --- Task Statuses ---
export const TASK_STATUSES: { value: TaskStatus; labelEn: string; labelZh: string; color: string }[] = [
  { value: 'pending', labelEn: 'Pending', labelZh: '待处理', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', labelEn: 'In Progress', labelZh: '进行中', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', labelEn: 'Completed', labelZh: '已完成', color: 'bg-green-100 text-green-800' },
  { value: 'failed', labelEn: 'Failed', labelZh: '失败', color: 'bg-red-100 text-red-800' },
  { value: 'no_response', labelEn: 'No Response', labelZh: '无响应', color: 'bg-orange-100 text-orange-800' },
]

// --- Ticket Categories ---
export const TICKET_CATEGORIES: { value: TicketCategory; labelEn: string; labelZh: string }[] = [
  { value: 'general', labelEn: 'General', labelZh: '一般' },
  { value: 'account', labelEn: 'Account', labelZh: '账户' },
  { value: 'ib_application', labelEn: 'IB Application', labelZh: 'IB申请' },
  { value: 'kyc', labelEn: 'KYC', labelZh: 'KYC' },
  { value: 'deposit', labelEn: 'Deposit', labelZh: '入金' },
  { value: 'withdrawal', labelEn: 'Withdrawal', labelZh: '出金' },
  { value: 'trading', labelEn: 'Trading', labelZh: '交易' },
  { value: 'technical', labelEn: 'Technical', labelZh: '技术' },
  { value: 'complaint', labelEn: 'Complaint', labelZh: '投诉' },
]

// --- Ticket Statuses ---
export const TICKET_STATUSES: { value: TicketStatus; labelEn: string; labelZh: string; color: string }[] = [
  { value: 'open', labelEn: 'Open', labelZh: '待处理', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', labelEn: 'In Progress', labelZh: '处理中', color: 'bg-blue-100 text-blue-800' },
  { value: 'on_hold', labelEn: 'On Hold', labelZh: '挂起', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'resolved', labelEn: 'Resolved', labelZh: '已解决', color: 'bg-green-100 text-green-800' },
  { value: 'closed', labelEn: 'Closed', labelZh: '已关闭', color: 'bg-gray-200 text-gray-600' },
]

// --- IB Deal Statuses ---
export const IB_DEAL_STATUSES: { value: IBDealStatus; labelEn: string; labelZh: string; color: string }[] = [
  { value: 'pending_approval', labelEn: 'Pending Approval', labelZh: '待审批', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', labelEn: 'Approved', labelZh: '已批准', color: 'bg-blue-100 text-blue-800' },
  { value: 'rejected', labelEn: 'Rejected', labelZh: '已拒绝', color: 'bg-red-100 text-red-800' },
  { value: 'active', labelEn: 'Active', labelZh: '生效中', color: 'bg-green-100 text-green-800' },
  { value: 'expired', labelEn: 'Expired', labelZh: '已过期', color: 'bg-gray-200 text-gray-600' },
]

// --- Priorities ---
export const PRIORITIES: { value: Priority; labelEn: string; labelZh: string; color: string }[] = [
  { value: 'low', labelEn: 'Low', labelZh: '低', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', labelEn: 'Medium', labelZh: '中', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', labelEn: 'High', labelZh: '高', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', labelEn: 'Urgent', labelZh: '紧急', color: 'bg-red-100 text-red-800' },
]

// --- User Statuses ---
export const USER_STATUSES: { value: UserStatus; labelEn: string; labelZh: string; dotColor: string }[] = [
  { value: 'active', labelEn: 'Active', labelZh: '在线', dotColor: 'bg-green-500' },
  { value: 'busy', labelEn: 'Busy', labelZh: '忙碌', dotColor: 'bg-yellow-500' },
  { value: 'offline', labelEn: 'Offline', labelZh: '离线', dotColor: 'bg-gray-400' },
]

// --- Roles ---
export const ROLES: { value: Role; labelEn: string; labelZh: string; descriptionEn: string; descriptionZh: string }[] = [
  { value: 'sales', labelEn: 'Sales', labelZh: '销售', descriptionEn: 'Acquire new clients, maintain relationships', descriptionZh: '负责拉新，维护客户关系' },
  { value: 'support', labelEn: 'Support', labelZh: '客服', descriptionEn: 'Communicate with clients, resolve issues', descriptionZh: '与客户沟通，答疑解惑，解决问题' },
  { value: 'manager', labelEn: 'Manager', labelZh: '管理', descriptionEn: 'Manage Sales and Support teams', descriptionZh: '管理Sales，Support团队' },
  { value: 'admin', labelEn: 'Admin', labelZh: '管理员', descriptionEn: 'System configuration, account management', descriptionZh: '系统配置，账户分配' },
]

// --- Regions ---
export const REGIONS: { value: Region; labelEn: string; labelZh: string }[] = [
  { value: 'asia', labelEn: 'Asia', labelZh: '亚洲' },
  { value: 'europe', labelEn: 'Europe', labelZh: '欧洲' },
  { value: 'africa', labelEn: 'Africa', labelZh: '非洲' },
  { value: 'north_america', labelEn: 'North America', labelZh: '北美洲' },
  { value: 'oceania', labelEn: 'Oceania', labelZh: '大洋洲' },
  { value: 'south_america', labelEn: 'South America', labelZh: '南美洲' },
  { value: 'other', labelEn: 'Other', labelZh: '其他' },
]

// --- Languages ---
export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh_tw', label: '中文（繁體）' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'th', label: 'ไทย' },
  { value: 'ko', label: '한국어' },
  { value: 'id', label: 'Indonesia' },
  { value: 'ms', label: 'Melayu' },
  { value: 'zh_cn', label: '中文 (简体)' },
]

// --- Channels ---
export const CHANNELS: { value: Channel; labelEn: string; labelZh: string }[] = [
  { value: 'livechat', labelEn: 'Live Chat', labelZh: '在线聊天' },
  { value: 'whatsapp', labelEn: 'WhatsApp', labelZh: 'WhatsApp' },
  { value: 'email', labelEn: 'Email', labelZh: '邮件' },
  { value: 'phone', labelEn: 'Phone', labelZh: '电话' },
]
