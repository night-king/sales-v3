import type { Role } from '@/types/common'

export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@')
  if (atIndex < 1) return email
  return email[0] + '***' + email.slice(atIndex)
}

/**
 * Determine whether contact info should be masked based on role and ownership.
 *
 * Rules (from PRD §4.11):
 * - Sales: full display for own clients (assignedTo === userId)
 * - Support: always masked, with "View Full" button
 * - Manager: full display
 * - Admin: N/A (no client module access)
 */
export function shouldMask(role: Role, clientAssignedTo?: string, currentUserId?: string): boolean {
  if (role === 'manager') return false
  if (role === 'sales' && clientAssignedTo && currentUserId && clientAssignedTo === currentUserId) return false
  return true
}
