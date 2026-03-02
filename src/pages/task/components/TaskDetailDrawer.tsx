import { useTranslation } from 'react-i18next'
import { useTaskStore } from '@/store/task-store'
import { mockUsers } from '@/data/users'
import { TASK_TYPES, CHANNELS } from '@/lib/constants'
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
import type { Task } from '@/types/task'

interface TaskDetailDrawerProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDrawer({ task, open, onOpenChange }: TaskDetailDrawerProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { updateTaskStatus, returnTask } = useTaskStore()

  if (!task) return null

  const typeConfig = TASK_TYPES.find((tt) => tt.value === task.type)
  const typeName = typeConfig ? (isZh ? typeConfig.labelZh : typeConfig.labelEn) : task.type

  const assignee = task.assignedTo
    ? mockUsers.find((u) => u.id === task.assignedTo)
    : null

  const creator = mockUsers.find((u) => u.id === task.createdBy)

  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate ? dueDate < new Date() && task.status !== 'completed' : false

  // Map communication logs to timeline entries
  const timelineEntries: TimelineEntry[] = task.communicationLogs.map((log) => {
    const handler = mockUsers.find((u) => u.id === log.handler)
    const channelConfig = CHANNELS.find((c) => c.value === log.channel)
    const channelLabel = channelConfig ? (isZh ? channelConfig.labelZh : channelConfig.labelEn) : log.channel
    const directionLabel = log.direction === 'inbound'
      ? (isZh ? '入站' : 'Inbound')
      : (isZh ? '出站' : 'Outbound')
    const durationStr = log.duration ? ` (${Math.floor(log.duration / 60)}m ${log.duration % 60}s)` : ''

    return {
      id: log.id,
      timestamp: new Date(log.timestamp).toLocaleString(),
      actor: `${handler?.name ?? log.handler} - ${channelLabel} ${directionLabel}${durationStr}`,
      content: log.content,
      type: log.direction === 'inbound' ? 'success' : 'default',
    }
  })

  const handleStart = () => {
    updateTaskStatus(task.id, 'in_progress')
    onOpenChange(false)
  }

  const handleComplete = () => {
    updateTaskStatus(task.id, 'completed')
    onOpenChange(false)
  }

  const handleFailed = () => {
    updateTaskStatus(task.id, 'failed')
    onOpenChange(false)
  }

  const handleNoResponse = () => {
    updateTaskStatus(task.id, 'no_response')
    onOpenChange(false)
  }

  const handleReturn = () => {
    returnTask(task.id)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{typeName}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.status')}</span>
              <StatusBadge status={task.status} type="task" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.priority')}</span>
              <PriorityTag priority={task.priority} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.type')}</span>
              <span className="text-sm font-medium">{typeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.client')}</span>
              <span className="text-sm font-medium">{task.clientId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.assignee')}</span>
              <span className="text-sm font-medium">
                {assignee?.name ?? (isZh ? '未分配' : 'Unassigned')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.createdBy')}</span>
              <span className="text-sm font-medium">{creator?.name ?? task.createdBy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.createdAt')}</span>
              <span className="text-sm">{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('table.dueDate')}</span>
              <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                {dueDate ? dueDate.toLocaleString() : '-'}
                {isOverdue && (
                  <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-0 text-xs">
                    {t('time.overdue')}
                  </Badge>
                )}
              </span>
            </div>
            {task.nextFollowUp && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isZh ? '下次跟进' : 'Next Follow-up'}
                </span>
                <span className="text-sm">{new Date(task.nextFollowUp).toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isZh ? '重试次数' : 'Retry Count'}
              </span>
              <span className="text-sm">{task.retryCount} / {task.maxRetries}</span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">{t('table.description')}</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </>
          )}

          {/* Communication Log */}
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">
              {isZh ? '沟通记录' : 'Communication Log'}
              <Badge variant="outline" className="ml-2">
                {task.communicationLogs.length}
              </Badge>
            </h4>
            {timelineEntries.length > 0 ? (
              <TimelineList entries={timelineEntries} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {isZh ? '暂无沟通记录' : 'No communication logs yet'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <Separator />
          <div className="flex flex-wrap gap-2 pb-4">
            {task.status === 'pending' && (
              <Button onClick={handleStart} className="flex-1">
                {t('actions.start')}
              </Button>
            )}

            {task.status === 'in_progress' && (
              <>
                <Button onClick={handleComplete} className="flex-1">
                  {t('actions.complete')}
                </Button>
                <Button variant="destructive" onClick={handleFailed} className="flex-1">
                  {t('actions.markFailed')}
                </Button>
                <Button variant="outline" onClick={handleNoResponse} className="flex-1">
                  {t('actions.markNoResponse')}
                </Button>
                <Button variant="secondary" onClick={handleReturn} className="w-full">
                  {t('actions.return')}
                </Button>
              </>
            )}

            {(task.status === 'completed' || task.status === 'failed' || task.status === 'no_response') && (
              <p className="text-sm text-muted-foreground w-full text-center py-2">
                {isZh ? '此任务已关闭，无可用操作' : 'This task is closed. No actions available.'}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
