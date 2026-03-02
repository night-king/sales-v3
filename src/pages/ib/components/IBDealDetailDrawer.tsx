import { useTranslation } from 'react-i18next'
import { useClientStore } from '@/store/client-store'
import { mockUsers } from '@/data/users'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TimelineList, type TimelineEntry } from '@/components/common/TimelineList'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { IBDeal, CommissionType } from '@/types/ib-deal'

interface IBDealDetailDrawerProps {
  deal: IBDeal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COMMISSION_TYPE_KEYS: Record<CommissionType, string> = {
  per_lot: 'commission.perLot',
  percentage: 'commission.percentage',
  fixed: 'commission.fixed',
}

const PAYMENT_FREQUENCY_KEYS: Record<string, string> = {
  one_time: 'payment.oneTime',
  monthly: 'payment.monthly',
  quarterly: 'payment.quarterly',
}

export function IBDealDetailDrawer({ deal, open, onOpenChange }: IBDealDetailDrawerProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const clients = useClientStore((s) => s.clients)

  if (!deal) return null

  const client = clients.find((c) => c.id === deal.clientId)
  const creator = mockUsers.find((u) => u.id === deal.createdBy)

  const commissionDisplay = (() => {
    if (deal.commissionType === 'percentage') return `${deal.commissionRate}%`
    if (deal.commissionType === 'fixed') return `$${deal.commissionRate.toLocaleString()}`
    return `$${deal.commissionRate} / lot`
  })()

  // Map approval history to timeline entries
  const timelineEntries: TimelineEntry[] = deal.approvalHistory.map((entry) => {
    const actor = mockUsers.find((u) => u.id === entry.actor)
    const actorName = actor?.name ?? entry.actor

    const actionLabels: Record<string, { en: string; zh: string }> = {
      created: { en: 'Created deal', zh: '创建了协议' },
      submitted: { en: 'Submitted for approval', zh: '提交审批' },
      approved: { en: 'Approved', zh: '已批准' },
      rejected: { en: 'Rejected', zh: '已拒绝' },
      modified: { en: 'Modified', zh: '已修改' },
    }

    const actionLabel = actionLabels[entry.action]
      ? (isZh ? actionLabels[entry.action].zh : actionLabels[entry.action].en)
      : entry.action

    const statusChangeText = entry.statusChange
      ? ` (${entry.statusChange.from} -> ${entry.statusChange.to})`
      : ''

    const reasonText = entry.reason ? `\n${entry.reason}` : ''

    const typeMap: Record<string, TimelineEntry['type']> = {
      approved: 'success',
      rejected: 'error',
      submitted: 'warning',
      created: 'default',
      modified: 'default',
    }

    return {
      id: entry.id,
      timestamp: new Date(entry.timestamp).toLocaleString(),
      actor: actorName,
      content: `${actionLabel}${statusChangeText}${reasonText}`,
      type: typeMap[entry.action] ?? 'default',
    }
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isZh ? 'IB协议详情' : 'IB Deal Details'}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.status')}</span>
              <StatusBadge status={deal.status} type="ib" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.client')}</span>
              <span className="text-sm font-medium">{client?.name ?? deal.clientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isZh ? '佣金费率' : 'Commission Rate'}
              </span>
              <span className="text-sm font-medium">{commissionDisplay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isZh ? '佣金类型' : 'Commission Type'}
              </span>
              <span className="text-sm font-medium">
                {t(COMMISSION_TYPE_KEYS[deal.commissionType])}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isZh ? '月度目标' : 'Monthly Target'}
              </span>
              <span className="text-sm font-medium max-w-[220px] text-right">
                {deal.monthlyTarget}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isZh ? '生效日期' : 'Effective Date'}
              </span>
              <span className="text-sm">{new Date(deal.effectiveDate).toLocaleDateString()}</span>
            </div>
            {deal.expiryDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isZh ? '到期日期' : 'Expiry Date'}
                </span>
                <span className="text-sm">{new Date(deal.expiryDate).toLocaleDateString()}</span>
              </div>
            )}
            {deal.extraPayment !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isZh ? '额外支付' : 'Extra Payment'}
                </span>
                <span className="text-sm font-medium">${deal.extraPayment.toLocaleString()}</span>
              </div>
            )}
            {deal.paymentFrequency && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isZh ? '支付频率' : 'Payment Frequency'}
                </span>
                <span className="text-sm font-medium">
                  {t(PAYMENT_FREQUENCY_KEYS[deal.paymentFrequency])}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.createdBy')}</span>
              <span className="text-sm font-medium">{creator?.name ?? deal.createdBy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.createdAt')}</span>
              <span className="text-sm">{new Date(deal.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Notes */}
          {deal.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {isZh ? '备注' : 'Notes'}
                </h4>
                <p className="text-sm text-muted-foreground">{deal.notes}</p>
              </div>
            </>
          )}

          {/* Approval History */}
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">
              {isZh ? '审批历史' : 'Approval History'}
              <Badge variant="outline" className="ml-2">
                {deal.approvalHistory.length}
              </Badge>
            </h4>
            {timelineEntries.length > 0 ? (
              <TimelineList entries={timelineEntries} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {isZh ? '暂无审批记录' : 'No approval history yet'}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
