export type Role = 'sales' | 'support' | 'manager' | 'admin'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type UserStatus = 'active' | 'busy' | 'offline'

export type Region =
  | 'asia'
  | 'europe'
  | 'africa'
  | 'north_america'
  | 'oceania'
  | 'south_america'
  | 'other'

export type Language =
  | 'en'
  | 'ja'
  | 'zh_tw'
  | 'vi'
  | 'th'
  | 'ko'
  | 'id'
  | 'ms'
  | 'zh_cn'

export type Channel = 'livechat' | 'whatsapp' | 'email' | 'phone'

export type Direction = 'outbound' | 'inbound'

export interface CommunicationLog {
  id: string
  channel: Channel
  direction: Direction
  timestamp: string
  content: string
  handler: string
  duration?: number // seconds, only for phone
}

export interface Notification {
  id: string
  type: 'task' | 'ticket' | 'ib' | 'client' | 'system'
  title: string
  description: string
  timestamp: string
  read: boolean
  link?: string
}
