import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { mockPerformance } from '@/data/performance'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Headphones,
  Clock,
  Target,
  AlertTriangle,
} from 'lucide-react'

export default function MyPerformancePage() {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const currentRole = useAuthStore((s) => s.currentRole)
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month')

  const isSales = currentRole === 'sales' || currentRole === 'manager'
  const isSupport = currentRole === 'support'

  const salesData = mockPerformance.salesPerformance.find(
    (p) => p.userId === currentUser?.id && p.period === period
  )
  const supportData = mockPerformance.supportPerformance.find(
    (p) => p.userId === currentUser?.id && p.period === period
  )

  // For manager, show first sales user by default
  const displaySalesData =
    salesData ??
    mockPerformance.salesPerformance.find((p) => p.period === period)
  const displaySupportData =
    supportData ??
    mockPerformance.supportPerformance.find((p) => p.period === period)

  // Chart data
  const salesChartData = isSales && displaySalesData
    ? [
        { name: 'New Clients', value: displaySalesData.newClients },
        { name: 'IB Deals', value: displaySalesData.ibDealsCreated },
        {
          name: 'Conv. Rate %',
          value: Math.round(displaySalesData.depositConversionRate * 100),
        },
        {
          name: 'Task Comp. %',
          value: Math.round(displaySalesData.taskCompletionRate * 100),
        },
      ]
    : []

  const supportChartData = isSupport && displaySupportData
    ? [
        { name: 'Total Tickets', value: displaySupportData.totalTickets },
        { name: 'Pending', value: displaySupportData.pendingTickets },
        {
          name: 'Resolution %',
          value: Math.round(displaySupportData.resolutionRate * 100),
        },
        {
          name: 'Resp. Time (min)',
          value: displaySupportData.firstResponseTime,
        },
      ]
    : []

  return (
    <div>
      <PageHeader
        title={t('menu:myPerformance')}
        actions={
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as 'week' | 'month' | 'quarter')}
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

      {/* Sales Stats */}
      {isSales && displaySalesData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title={t('dashboard.newClients')}
              value={displaySalesData.newClients}
              icon={Users}
            />
            <StatCard
              title={t('dashboard.conversionRate')}
              value={`${Math.round(displaySalesData.depositConversionRate * 100)}%`}
              icon={TrendingUp}
            />
            <StatCard
              title="Deposit Amount"
              value={`$${displaySalesData.totalDepositAmount.toLocaleString()}`}
              icon={DollarSign}
            />
            <StatCard
              title="Task Completion"
              value={`${Math.round(displaySalesData.taskCompletionRate * 100)}%`}
              icon={CheckCircle}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Support Stats */}
      {isSupport && displaySupportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title={t('dashboard.ticketCount')}
              value={displaySupportData.totalTickets}
              icon={Headphones}
            />
            <StatCard
              title="Avg Response Time"
              value={`${displaySupportData.firstResponseTime} min`}
              icon={Clock}
            />
            <StatCard
              title={t('dashboard.resolutionRate')}
              value={`${Math.round(displaySupportData.resolutionRate * 100)}%`}
              icon={Target}
            />
            <StatCard
              title="Escalation Rate"
              value={`${Math.round(displaySupportData.escalationRate * 100)}%`}
              icon={AlertTriangle}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supportChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Fallback for admin */}
      {!isSales && !isSupport && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Performance data is available for Sales and Support roles.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
