import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { PRIORITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Priority } from '@/types/common'

interface PriorityTagProps {
  priority: Priority
  className?: string
}

export function PriorityTag({ priority, className }: PriorityTagProps) {
  const { i18n } = useTranslation()
  const config = PRIORITIES.find((p) => p.value === priority)
  if (!config) return null

  const label = i18n.language === 'zh' ? config.labelZh : config.labelEn

  return (
    <Badge variant="outline" className={cn(config.color, 'border-0 font-medium', className)}>
      {label}
    </Badge>
  )
}
