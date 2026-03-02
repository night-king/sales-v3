import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { mockPerformance } from '@/data/performance'
import type { SalesPerformance, SupportPerformance } from '@/data/performance'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { DataTable } from '@/components/data-table/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, DollarSign, Headphones, Target } from 'lucide-react'

export default function TeamPerformancePage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month')

  const salesData = mockPerformance.salesPerformance.filter(
    (p) => p.period === period
  )
  const supportData = mockPerformance.supportPerformance.filter(
    (p) => p.period === period
  )

  // Summary metrics
  const totalNewClients = salesData.reduce((sum, s) => sum + s.newClients, 0)
  const totalDeposits = salesData.reduce(
    (sum, s) => sum + s.totalDepositAmount,
    0
  )
  const totalTickets = supportData.reduce((sum, s) => sum + s.totalTickets, 0)
  const avgResolutionRate =
    supportData.length > 0
      ? supportData.reduce((sum, s) => sum + s.resolutionRate, 0) /
        supportData.length
      : 0

  const salesColumns: ColumnDef<SalesPerformance, unknown>[] = [
    {
      id: 'rank',
      header: '#',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'userName',
      header: t('table.name'),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.userName}</span>
      ),
    },
    {
      accessorKey: 'newClients',
      header: t('dashboard.newClients'),
    },
    {
      accessorKey: 'depositConversionRate',
      header: t('dashboard.conversionRate'),
      cell: ({ row }) =>
        `${Math.round(row.original.depositConversionRate * 100)}%`,
    },
    {
      accessorKey: 'totalDepositAmount',
      header: 'Deposits',
      cell: ({ row }) =>
        `$${row.original.totalDepositAmount.toLocaleString()}`,
    },
    {
      accessorKey: 'ibDealsCreated',
      header: 'IB Deals',
    },
    {
      accessorKey: 'taskCompletionRate',
      header: 'Task Completion',
      cell: ({ row }) =>
        `${Math.round(row.original.taskCompletionRate * 100)}%`,
    },
  ]

  const supportColumns: ColumnDef<SupportPerformance, unknown>[] = [
    {
      id: 'rank',
      header: '#',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'userName',
      header: t('table.name'),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.userName}</span>
      ),
    },
    {
      accessorKey: 'totalTickets',
      header: t('dashboard.ticketCount'),
    },
    {
      accessorKey: 'firstResponseTime',
      header: 'Resp. Time',
      cell: ({ row }) => `${row.original.firstResponseTime} min`,
    },
    {
      accessorKey: 'avgResolutionTime',
      header: 'Avg Resolution',
      cell: ({ row }) => `${row.original.avgResolutionTime}h`,
    },
    {
      accessorKey: 'resolutionRate',
      header: t('dashboard.resolutionRate'),
      cell: ({ row }) =>
        `${Math.round(row.original.resolutionRate * 100)}%`,
    },
    {
      accessorKey: 'escalationRate',
      header: 'Escalation',
      cell: ({ row }) =>
        `${Math.round(row.original.escalationRate * 100)}%`,
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('menu:teamPerformance')}
        actions={
          <Select
            value={period}
            onValueChange={(v) =>
              setPeriod(v as 'week' | 'month' | 'quarter')
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t('dashboard.newClients')}
          value={totalNewClients}
          icon={Users}
        />
        <StatCard
          title="Total Deposits"
          value={`$${totalDeposits.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title={t('dashboard.ticketCount')}
          value={totalTickets}
          icon={Headphones}
        />
        <StatCard
          title={t('dashboard.resolutionRate')}
          value={`${Math.round(avgResolutionRate * 100)}%`}
          icon={Target}
        />
      </div>

      {/* Sales Leaderboard */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Sales Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={salesColumns} data={salesData} pageSize={10} />
        </CardContent>
      </Card>

      {/* Support Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Support Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={supportColumns}
            data={supportData}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
