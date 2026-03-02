import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable, type FilterConfig } from '@/components/data-table/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityTag } from '@/components/common/PriorityTag'
import { mockUsers } from '@/data/users'
import { TASK_TYPES, TASK_STATUSES, PRIORITIES } from '@/lib/constants'
import type { ColumnDef } from '@tanstack/react-table'
import type { Task } from '@/types/task'

interface TaskTableProps {
  data: Task[]
  onRowClick: (task: Task) => void
  actions?: (task: Task) => ReactNode
}

export function TaskTable({ data, onRowClick, actions }: TaskTableProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const columns: ColumnDef<Task, unknown>[] = [
    {
      accessorKey: 'type',
      header: t('table.type'),
      cell: ({ row }) => {
        const typeConfig = TASK_TYPES.find((tt) => tt.value === row.original.type)
        return typeConfig ? (isZh ? typeConfig.labelZh : typeConfig.labelEn) : row.original.type
      },
    },
    {
      accessorKey: 'priority',
      header: t('table.priority'),
      cell: ({ row }) => <PriorityTag priority={row.original.priority} />,
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => <StatusBadge status={row.original.status} type="task" />,
    },
    {
      accessorKey: 'clientName',
      header: t('table.client'),
      cell: ({ row }) => {
        // Task type does not have clientName, so look up from clientId
        // For display purposes we use description's client info or just clientId
        return row.original.clientId
      },
    },
    {
      accessorKey: 'assignedTo',
      header: t('table.assignee'),
      cell: ({ row }) => {
        if (!row.original.assignedTo) return <span className="text-muted-foreground">-</span>
        const user = mockUsers.find((u) => u.id === row.original.assignedTo)
        return user?.name ?? row.original.assignedTo
      },
    },
    {
      accessorKey: 'dueDate',
      header: t('table.dueDate'),
      cell: ({ row }) => {
        const dueDate = row.original.dueDate
        if (!dueDate) return <span className="text-muted-foreground">-</span>
        const due = new Date(dueDate)
        const now = new Date()
        const isOverdue = due < now && row.original.status !== 'completed'
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {due.toLocaleDateString()}
          </span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('table.createdAt'),
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ]

  // Add actions column if provided
  if (actions) {
    columns.push({
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          {actions(row.original)}
        </div>
      ),
      enableSorting: false,
    })
  }

  const filters: FilterConfig[] = [
    {
      columnId: 'type',
      label: t('table.type'),
      options: TASK_TYPES.map((tt) => ({
        value: tt.value,
        label: isZh ? tt.labelZh : tt.labelEn,
      })),
    },
    {
      columnId: 'status',
      label: t('table.status'),
      options: TASK_STATUSES.map((ts) => ({
        value: ts.value,
        label: isZh ? ts.labelZh : ts.labelEn,
      })),
    },
    {
      columnId: 'priority',
      label: t('table.priority'),
      options: PRIORITIES.map((p) => ({
        value: p.value,
        label: isZh ? p.labelZh : p.labelEn,
      })),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder={t('table.client')}
      searchColumn="clientId"
      filters={filters}
      onRowClick={onRowClick}
    />
  )
}
