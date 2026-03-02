import { useAuthStore } from '@/store/auth-store'
import { hasPermission, type Module, type Action } from '@/lib/permissions'
import { getMenuForRole } from '@/lib/menu-config'

export function usePermission() {
  const currentRole = useAuthStore((s) => s.currentRole)

  const canAccess = (module: Module, action: Action) =>
    hasPermission(currentRole, module, action)

  const getMenuItems = () => getMenuForRole(currentRole)

  return { canAccess, getMenuItems }
}
