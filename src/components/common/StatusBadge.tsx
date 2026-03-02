import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { CLIENT_STATUSES, TASK_STATUSES, TICKET_STATUSES, IB_DEAL_STATUSES } from '@/lib/constants'
import { cn } from '@/lib/utils'

type StatusType = 'client' | 'task' | 'ticket' | 'ib'

const STATUS_MAP: Record<StatusType, { value: string; labelEn: string; labelZh: string; color: string }[]> = {
  client: CLIENT_STATUSES,
  task: TASK_STATUSES,
  ticket: TICKET_STATUSES,
  ib: IB_DEAL_STATUSES,
}

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const { i18n } = useTranslation()
  const config = STATUS_MAP[type]?.find((s) => s.value === status)
  if (!config) return <Badge variant="outline">{status}</Badge>

  const label = i18n.language === 'zh' ? config.labelZh : config.labelEn

  return (
    <Badge variant="outline" className={cn(config.color, 'border-0 font-medium', className)}>
      {label}
    </Badge>
  )
}
