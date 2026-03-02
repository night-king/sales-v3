import { useAuthStore } from '@/store/auth-store'
import type { Role } from '@/types/common'

export function useRole() {
  const currentRole = useAuthStore((s) => s.currentRole)
  const currentUser = useAuthStore((s) => s.currentUser)
  const switchRole = useAuthStore((s) => s.switchRole)

  const isRole = (role: Role) => currentRole === role

  return { currentRole, currentUser, isRole, switchRole }
}
