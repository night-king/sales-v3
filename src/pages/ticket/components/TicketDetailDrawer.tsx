import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTicketStore } from '@/store/ticket-store'
import { useClientStore } from '@/store/client-store'
import { mockUsers } from '@/data/users'
import { TICKET_CATEGORIES, CHANNELS } from '@/lib/constants'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityTag } from '@/components/common/PriorityTag'
import { TimelineList, type TimelineEntry } from '@/components/common/TimelineList'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { EscalateDialog } from './EscalateDialog'
import type { Ticket } from '@/types/ticket'

interface TicketDetailDrawerProps {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketDetailDrawer({ ticket, open, onOpenChange }: TicketDetailDrawerProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { updateTicketStatus } = useTicketStore()
  const clients = useClientStore((s) => s.clients)

  const [escalateOpen, setEscalateOpen] = useState(false)

  if (!ticket) return null

  const categoryConfig = TICKET_CATEGORIES.find((c) => c.value === ticket.category)
  const categoryName = categoryConfig ? (isZh ? categoryConfig.labelZh : categoryConfig.labelEn) : ticket.category

  const channelConfig = CHANNELS.find((c) => c.value === ticket.channel)
  const channelName = channelConfig ? (isZh ? channelConfig.labelZh : channelConfig.labelEn) : ticket.channel

  const client = clients.find((c) => c.id === ticket.clientId)
  const clientName = client?.name ?? ticket.clientId

  const assignee = ticket.assignedTo
    ? mockUsers.find((u) => u.id === ticket.assignedTo)
    : null

  const creator = mockUsers.find((u) => u.id === ticket.createdBy)

  const sourceLabel = ticket.source === 'crm_issue'
    ? 'CRM'
    : (isZh ? '内部创建' : 'Internal')

  // Map escalation history to timeline entries
  const escalationEntries: TimelineEntry[] = ticket.escalationHistory.map((esc) => {
    const actor = mockUsers.find((u) => u.id === esc.createdBy)
    const typeLabel = esc.type === 'submit_to_manager'
      ? t('escalation.submitToManager')
      : t('escalation.forwardToSales')

    return {
      id: esc.id,
      timestamp: new Date(esc.createdAt).toLocaleString(),
      actor: actor?.name ?? esc.createdBy,
      content: `[${typeLabel}] ${esc.reason}${esc.notes ? ` - ${esc.notes}` : ''}`,
      type: 'warning',
    }
  })

  // Map processing history to timeline entries
  const historyEntries: TimelineEntry[] = ticket.history.map((entry) => {
    const actor = mockUsers.find((u) => u.id === entry.actor)
    return {
      id: entry.id,
      timestamp: new Date(entry.timestamp).toLocaleString(),
      actor: actor?.name ?? entry.actor,
      content: `[${entry.action}] ${entry.details ?? ''}`,
      type: entry.action === 'escalated' ? 'warning' : entry.action === 'resolved' ? 'success' : 'default',
    }
  })

  const handleStartProcessing = () => {
    updateTicketStatus(ticket.id, 'in_progress')
    onOpenChange(false)
  }

  const handleResolve = () => {
    updateTicketStatus(ticket.id, 'resolved')
    onOpenChange(false)
  }

  const handleClose = () => {
    updateTicketStatus(ticket.id, 'closed')
    onOpenChange(false)
  }

  const handleReopen = () => {
    updateTicketStatus(ticket.id, 'open')
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{categoryName} - {ticket.id}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.status')}</span>
                <StatusBadge status={ticket.status} type="ticket" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.priority')}</span>
                <PriorityTag priority={ticket.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.category')}</span>
                <span className="text-sm font-medium">{categoryName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.source')}</span>
                <span className="text-sm font-medium">{sourceLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.channel')}</span>
                <span className="text-sm font-medium">{channelName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.client')}</span>
                <span className="text-sm font-medium">{clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.assignee')}</span>
                <span className="text-sm font-medium">
                  {assignee?.name ?? (isZh ? '未分配' : 'Unassigned')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.createdBy')}</span>
                <span className="text-sm font-medium">{creator?.name ?? ticket.createdBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('table.createdAt')}</span>
                <span className="text-sm">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              {ticket.crmIssueId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">CRM Issue ID</span>
                  <span className="text-sm font-medium">{ticket.crmIssueId}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">{isZh ? '工单内容' : 'Ticket Content'}</h4>
              <p className="text-sm text-muted-foreground">{ticket.content}</p>
            </div>

            {/* Escalation History */}
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">
                {isZh ? '升级记录' : 'Escalation History'}
                <Badge variant="outline" className="ml-2">
                  {ticket.escalationHistory.length}
                </Badge>
              </h4>
              {escalationEntries.length > 0 ? (
                <TimelineList entries={escalationEntries} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isZh ? '暂无升级记录' : 'No escalation history'}
                </p>
              )}
            </div>

            {/* Processing History */}
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">
                {isZh ? '处理记录' : 'Processing History'}
                <Badge variant="outline" className="ml-2">
                  {ticket.history.length}
                </Badge>
              </h4>
              {historyEntries.length > 0 ? (
                <TimelineList entries={historyEntries} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isZh ? '暂无处理记录' : 'No processing history'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <Separator />
            <div className="flex flex-wrap gap-2 pb-4">
              {ticket.status === 'open' && (
                <Button onClick={handleStartProcessing} className="flex-1">
                  {t('actions.start')}
                </Button>
              )}

              {ticket.status === 'in_progress' && (
                <>
                  <Button onClick={handleResolve} className="flex-1">
                    {t('actions.resolve')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEscalateOpen(true)}
                    className="flex-1"
                  >
                    {t('actions.escalate')}
                  </Button>
                  <Button variant="destructive" onClick={handleClose} className="flex-1">
                    {t('actions.close')}
                  </Button>
                </>
              )}

              {ticket.status === 'on_hold' && (
                <p className="text-sm text-muted-foreground w-full text-center py-2">
                  {isZh ? '等待升级响应中' : 'Waiting for escalation response'}
                </p>
              )}

              {ticket.status === 'resolved' && (
                <>
                  <Button onClick={handleClose} className="flex-1">
                    {t('actions.close')}
                  </Button>
                  <Button variant="outline" onClick={handleReopen} className="flex-1">
                    {t('actions.reopen')}
                  </Button>
                </>
              )}

              {ticket.status === 'closed' && (
                <Button variant="outline" onClick={handleReopen} className="w-full">
                  {t('actions.reopen')}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EscalateDialog
        ticketId={ticket.id}
        open={escalateOpen}
        onOpenChange={setEscalateOpen}
      />
    </>
  )
}
