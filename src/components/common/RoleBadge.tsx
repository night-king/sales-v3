import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Role } from '@/types/common'

const ROLE_COLORS: Record<Role, string> = {
  sales: 'bg-blue-100 text-blue-700',
  support: 'bg-green-100 text-green-700',
  manager: 'bg-purple-100 text-purple-700',
  admin: 'bg-orange-100 text-orange-700',
}

interface RoleBadgeProps {
  role: Role
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { t } = useTranslation()
  return (
    <Badge variant="outline" className={cn(ROLE_COLORS[role], 'border-0 font-medium', className)}>
      {t(`roles.${role}`)}
    </Badge>
  )
}
