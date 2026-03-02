import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable, type FilterConfig } from '@/components/data-table/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useClientStore } from '@/store/client-store'
import { IB_DEAL_STATUSES } from '@/lib/constants'
import type { ColumnDef } from '@tanstack/react-table'
import type { IBDeal, CommissionType } from '@/types/ib-deal'

interface IBDealTableProps {
  data: IBDeal[]
  onRowClick: (deal: IBDeal) => void
  actions?: (deal: IBDeal) => ReactNode
}

const COMMISSION_TYPE_KEYS: Record<CommissionType, string> = {
  per_lot: 'commission.perLot',
  percentage: 'commission.percentage',
  fixed: 'commission.fixed',
}

export function IBDealTable({ data, onRowClick, actions }: IBDealTableProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const clients = useClientStore((s) => s.clients)

  const columns: ColumnDef<IBDeal, unknown>[] = [
    {
      accessorKey: 'clientName',
      header: t('table.client'),
      cell: ({ row }) => {
        const client = clients.find((c) => c.id === row.original.clientId)
        return client?.name ?? row.original.clientId
      },
    },
    {
      accessorKey: 'commissionRate',
      header: isZh ? '佣金费率' : 'Commission Rate',
      cell: ({ row }) => {
        const { commissionRate, commissionType } = row.original
        if (commissionType === 'percentage') return `${commissionRate}%`
        if (commissionType === 'fixed') return `$${commissionRate.toLocaleString()}`
        return `$${commissionRate} / lot`
      },
    },
    {
      accessorKey: 'commissionType',
      header: isZh ? '佣金类型' : 'Commission Type',
      cell: ({ row }) => t(COMMISSION_TYPE_KEYS[row.original.commissionType]),
    },
    {
      accessorKey: 'monthlyTarget',
      header: isZh ? '月度目标' : 'Monthly Target',
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate block" title={row.original.monthlyTarget}>
          {row.original.monthlyTarget}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => <StatusBadge status={row.original.status} type="ib" />,
    },
    {
      accessorKey: 'effectiveDate',
      header: isZh ? '生效日期' : 'Effective Date',
      cell: ({ row }) => new Date(row.original.effectiveDate).toLocaleDateString(),
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
      columnId: 'status',
      label: t('table.status'),
      options: IB_DEAL_STATUSES.map((s) => ({
        value: s.value,
        label: isZh ? s.labelZh : s.labelEn,
      })),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder={t('table.client')}
      searchColumn="clientName"
      filters={filters}
      onRowClick={onRowClick}
    />
  )
}
