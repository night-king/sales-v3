import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DataTable, type FilterConfig } from '@/components/data-table/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { CLIENT_STATUSES } from '@/lib/constants'
import { mockUsers } from '@/data/users'
import { maskPhone, maskEmail, shouldMask } from '@/lib/mask'
import { useRole } from '@/hooks/use-role'
import type { ColumnDef } from '@tanstack/react-table'
import type { Client } from '@/types/client'

interface ClientTableProps {
  data: Client[]
  actions?: (client: Client) => ReactNode
  onRowClick?: (client: Client) => void
}

export function ClientTable({ data, actions, onRowClick }: ClientTableProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { currentRole, currentUser } = useRole()

  // Extract unique countries from client data for filter options
  const countryOptions = Array.from(new Set(data.map((c) => c.country)))
    .sort()
    .map((country) => ({ label: country, value: country }))

  const statusOptions = CLIENT_STATUSES.map((s) => ({
    label: i18n.language === 'zh' ? s.labelZh : s.labelEn,
    value: s.value,
  }))

  const filters: FilterConfig[] = [
    {
      columnId: 'status',
      label: t('table.status'),
      options: statusOptions,
    },
    {
      columnId: 'country',
      label: t('table.country'),
      options: countryOptions,
    },
  ]

  const columns: ColumnDef<Client, unknown>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
      cell: ({ row }) => (
        <button
          className="text-primary hover:underline font-medium text-left"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/client/${row.original.id}`)
          }}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: 'country',
      header: t('table.country'),
    },
    {
      accessorKey: 'phone',
      header: t('table.phone'),
      cell: ({ row }) => {
        const masked = shouldMask(currentRole, row.original.assignedTo, currentUser?.id)
        return <span>{masked ? maskPhone(row.original.phone) : row.original.phone}</span>
      },
    },
    {
      accessorKey: 'email',
      header: t('table.email'),
      cell: ({ row }) => {
        const masked = shouldMask(currentRole, row.original.assignedTo, currentUser?.id)
        return <span>{masked ? maskEmail(row.original.email) : row.original.email}</span>
      },
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} type="client" />
      ),
    },
    {
      accessorKey: 'walletBalance',
      header: t('table.balance'),
      cell: ({ row }) => (
        <span>${row.original.walletBalance.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: t('table.assignedTo'),
      cell: ({ row }) => {
        const user = mockUsers.find((u) => u.id === row.original.assignedTo)
        return <span>{user?.name ?? '-'}</span>
      },
    },
  ]

  // Append actions column if actions renderer is provided
  if (actions) {
    columns.push({
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => actions(row.original),
      enableSorting: false,
    })
  }

  return (
    <DataTable<Client>
      columns={columns}
      data={data}
      searchPlaceholder={t('form.searchPlaceholder')}
      searchColumn="name"
      filters={filters}
      onRowClick={onRowClick}
    />
  )
}
