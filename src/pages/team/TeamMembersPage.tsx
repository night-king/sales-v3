import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { mockUsers } from '@/data/users'
import { DataTable } from '@/components/data-table/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleBadge } from '@/components/common/RoleBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { USER_STATUSES, LANGUAGES, REGIONS } from '@/lib/constants'
import { useTaskStore } from '@/store/task-store'
import { useNotificationStore } from '@/store/notification-store'
import type { User } from '@/types/user'

export default function TeamMembersPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const tasks = useTaskStore((s) => s.tasks)
  const returnTask = useTaskStore((s) => s.returnTask)
  const addNotification = useNotificationStore((s) => s.addNotification)

  const [statusMap, setStatusMap] = useState<Record<string, string>>({})
  const [pendingOfflineUser, setPendingOfflineUser] = useState<User | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [userTaskCount, setUserTaskCount] = useState(0)

  const getEffectiveStatus = (user: User) => statusMap[user.id] ?? user.status

  const handleStatusToggle = (user: User) => {
    const currentStatus = getEffectiveStatus(user)

    if (currentStatus === 'offline') {
      // Toggle to active
      setStatusMap((prev) => ({ ...prev, [user.id]: 'active' }))
      addNotification({
        type: 'system',
        title: isZh ? '状态变更' : 'Status Changed',
        description: isZh
          ? `${user.name} 已设置为在线`
          : `${user.name} has been set to active`,
      })
      return
    }

    // Toggling to offline -- check for active tasks
    const activeTasks = tasks.filter(
      (task) => task.assignedTo === user.id && task.status === 'in_progress'
    )

    if (activeTasks.length > 0) {
      setPendingOfflineUser(user)
      setUserTaskCount(activeTasks.length)
      setShowConfirmDialog(true)
    } else {
      setStatusMap((prev) => ({ ...prev, [user.id]: 'offline' }))
      addNotification({
        type: 'system',
        title: isZh ? '状态变更' : 'Status Changed',
        description: isZh
          ? `${user.name} 已设置为离线`
          : `${user.name} has been set to offline`,
      })
    }
  }

  const handleConfirmOffline = () => {
    if (!pendingOfflineUser) return

    // Return all in-progress tasks to pool
    const activeTasks = tasks.filter(
      (task) => task.assignedTo === pendingOfflineUser.id && task.status === 'in_progress'
    )
    activeTasks.forEach((task) => returnTask(task.id))

    // Update status
    setStatusMap((prev) => ({ ...prev, [pendingOfflineUser.id]: 'offline' }))

    addNotification({
      type: 'system',
      title: isZh ? '用户离线' : 'User Set Offline',
      description: isZh
        ? `${pendingOfflineUser.name} 已离线，${activeTasks.length} 个任务已退回任务池`
        : `${pendingOfflineUser.name} set offline, ${activeTasks.length} task(s) returned to pool`,
    })

    setShowConfirmDialog(false)
    setPendingOfflineUser(null)
  }

  const handleCancelOffline = () => {
    setShowConfirmDialog(false)
    setPendingOfflineUser(null)
  }

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
    },
    {
      accessorKey: 'role',
      header: t('role', { ns: 'menu' }),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        const effectiveStatus = getEffectiveStatus(row.original)
        const status = USER_STATUSES.find((s) => s.value === effectiveStatus)
        return (
          <button
            type="button"
            onClick={() => handleStatusToggle(row.original)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
            title={isZh ? '点击切换状态' : 'Click to toggle status'}
          >
            <span className={`h-2 w-2 rounded-full ${status?.dotColor ?? 'bg-gray-400'}`} />
            <span>{isZh ? status?.labelZh : status?.labelEn}</span>
          </button>
        )
      },
    },
    {
      accessorKey: 'languages',
      header: t('table.language'),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.languages.map((lang) => {
            const langInfo = LANGUAGES.find((l) => l.value === lang)
            return (
              <Badge key={lang} variant="secondary" className="text-xs">
                {langInfo?.label ?? lang}
              </Badge>
            )
          })}
        </div>
      ),
    },
    {
      id: 'regions',
      header: t('region.asia', { defaultValue: 'Regions' }),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.regions.map((region) => {
            const regionInfo = REGIONS.find((r) => r.value === region)
            return (
              <Badge key={region} variant="outline" className="text-xs">
                {isZh ? regionInfo?.labelZh : regionInfo?.labelEn}
              </Badge>
            )
          })}
        </div>
      ),
    },
    {
      id: 'skills',
      header: 'Skills',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.original.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill.replace(/_/g, ' ')}
            </Badge>
          ))}
          {row.original.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.skills.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('menu:teamMembers')} />
      <DataTable
        columns={columns}
        data={mockUsers}
        searchColumn="name"
        searchPlaceholder={t('actions.search')}
        filters={[
          {
            columnId: 'role',
            label: t('menu:role'),
            options: [
              { value: 'sales', label: t('roles.sales') },
              { value: 'support', label: t('roles.support') },
              { value: 'manager', label: t('roles.manager') },
              { value: 'admin', label: t('roles.admin') },
            ],
          },
          {
            columnId: 'status',
            label: t('table.status'),
            options: USER_STATUSES.map((s) => ({
              value: s.value,
              label: isZh ? s.labelZh : s.labelEn,
            })),
          },
        ]}
      />

      {/* Confirmation Dialog for offline toggle with active tasks */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isZh ? '确认设置离线' : 'Confirm Set Offline'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {isZh
              ? `${pendingOfflineUser?.name} 有 ${userTaskCount} 个进行中的任务。是否将这些任务退回任务池？`
              : `${pendingOfflineUser?.name} has ${userTaskCount} active task(s). Return them to the task pool?`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelOffline}>
              {isZh ? '取消' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleConfirmOffline}>
              {isZh ? '确认离线' : 'Confirm Offline'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
