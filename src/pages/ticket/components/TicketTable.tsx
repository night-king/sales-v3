import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable, type FilterConfig } from '@/components/data-table/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityTag } from '@/components/common/PriorityTag'
import { Badge } from '@/components/ui/badge'
import { mockUsers } from '@/data/users'
import { useClientStore } from '@/store/client-store'
import { TICKET_CATEGORIES, TICKET_STATUSES, PRIORITIES } from '@/lib/constants'
import type { ColumnDef } from '@tanstack/react-table'
import type { Ticket } from '@/types/ticket'

interface TicketTableProps {
  data: Ticket[]
  onRowClick: (ticket: Ticket) => void
  actions?: (ticket: Ticket) => ReactNode
}

export function TicketTable({ data, onRowClick, actions }: TicketTableProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const clients = useClientStore((s) => s.clients)

  const columns: ColumnDef<Ticket, unknown>[] = [
    {
      accessorKey: 'source',
      header: t('table.source'),
      cell: ({ row }) => {
        const source = row.original.source
        return source === 'crm_issue' ? (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-0 font-medium">
            CRM
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-sky-100 text-sky-800 border-0 font-medium">
            {isZh ? '内部' : 'Internal'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'category',
      header: t('table.category'),
      cell: ({ row }) => {
        const catConfig = TICKET_CATEGORIES.find((c) => c.value === row.original.category)
        return catConfig ? (isZh ? catConfig.labelZh : catConfig.labelEn) : row.original.category
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
      cell: ({ row }) => <StatusBadge status={row.original.status} type="ticket" />,
    },
    {
      accessorKey: 'clientId',
      header: t('table.client'),
      cell: ({ row }) => {
        const client = clients.find((c) => c.id === row.original.clientId)
        return client?.name ?? row.original.clientId
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
      columnId: 'category',
      label: t('table.category'),
      options: TICKET_CATEGORIES.map((c) => ({
        value: c.value,
        label: isZh ? c.labelZh : c.labelEn,
      })),
    },
    {
      columnId: 'status',
      label: t('table.status'),
      options: TICKET_STATUSES.map((s) => ({
        value: s.value,
        label: isZh ? s.labelZh : s.labelEn,
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
