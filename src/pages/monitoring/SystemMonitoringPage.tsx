import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { DataTable } from '@/components/data-table/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertTriangle, Inbox, Clock } from 'lucide-react'

interface QueueStats {
  name: string
  rate: number
  backlog: number
  status: 'healthy' | 'warning' | 'critical'
}

interface DeadLetterEntry {
  id: string
  queue: string
  message: string
  error: string
  timestamp: string
  retries: number
}

const mockQueues: QueueStats[] = [
  { name: 'client.events', rate: 142, backlog: 3, status: 'healthy' },
  { name: 'task.assignments', rate: 56, backlog: 0, status: 'healthy' },
  { name: 'ticket.updates', rate: 89, backlog: 12, status: 'warning' },
  { name: 'notification.push', rate: 210, backlog: 0, status: 'healthy' },
  { name: 'ib.commission.calc', rate: 18, backlog: 45, status: 'critical' },
]

const mockDeadLetters: DeadLetterEntry[] = [
  {
    id: 'dl-1',
    queue: 'client.events',
    message: 'client.kyc_approved - Client ID: C-10234',
    error: 'Target user not found for auto-assignment',
    timestamp: '2026-03-02T08:15:00Z',
    retries: 3,
  },
  {
    id: 'dl-2',
    queue: 'notification.push',
    message: 'push.notification - User ID: user-sales-3',
    error: 'FCM token expired',
    timestamp: '2026-03-02T07:45:00Z',
    retries: 3,
  },
  {
    id: 'dl-3',
    queue: 'ib.commission.calc',
    message: 'commission.calculate - Deal ID: IB-2045',
    error: 'Commission rate configuration missing',
    timestamp: '2026-03-02T06:30:00Z',
    retries: 3,
  },
  {
    id: 'dl-4',
    queue: 'ticket.updates',
    message: 'ticket.status_change - Ticket ID: T-8891',
    error: 'Database connection timeout',
    timestamp: '2026-03-01T23:10:00Z',
    retries: 3,
  },
  {
    id: 'dl-5',
    queue: 'task.assignments',
    message: 'task.auto_assign - Task ID: TASK-1120',
    error: 'All eligible users at max capacity',
    timestamp: '2026-03-01T21:55:00Z',
    retries: 3,
  },
]

const STATUS_COLORS: Record<string, string> = {
  healthy: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  critical: 'bg-red-100 text-red-700',
}

export default function SystemMonitoringPage() {
  const { t } = useTranslation()

  const healthyCount = mockQueues.filter((q) => q.status === 'healthy').length
  const totalBacklog = mockQueues.reduce((sum, q) => sum + q.backlog, 0)
  const totalRate = mockQueues.reduce((sum, q) => sum + q.rate, 0)

  const deadLetterColumns: ColumnDef<DeadLetterEntry, unknown>[] = [
    {
      accessorKey: 'queue',
      header: 'Queue',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-mono">
          {row.original.queue}
        </Badge>
      ),
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <span className="text-sm font-mono">{row.original.message}</span>
      ),
    },
    {
      accessorKey: 'error',
      header: 'Error',
      cell: ({ row }) => (
        <span className="text-sm text-destructive">{row.original.error}</span>
      ),
    },
    {
      accessorKey: 'retries',
      header: 'Retries',
    },
    {
      accessorKey: 'timestamp',
      header: t('table.createdAt'),
      cell: ({ row }) =>
        new Date(row.original.timestamp).toLocaleString(),
    },
  ]

  return (
    <div>
      <PageHeader title={t('menu:systemMonitoring')} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t('dashboard.systemHealth')}
          value={`${healthyCount}/${mockQueues.length}`}
          icon={Activity}
        />
        <StatCard
          title="Message Rate"
          value={`${totalRate}/min`}
          icon={Inbox}
        />
        <StatCard
          title="Total Backlog"
          value={totalBacklog}
          icon={Clock}
        />
        <StatCard
          title={t('dashboard.deadLetterQueue')}
          value={mockDeadLetters.length}
          icon={AlertTriangle}
        />
      </div>

      {/* Event Queues */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Event Queues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockQueues.map((queue) => (
              <Card key={queue.name} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium">
                      {queue.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`border-0 text-xs ${STATUS_COLORS[queue.status]}`}
                    >
                      {queue.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Rate: {queue.rate}/min</span>
                    <span>Backlog: {queue.backlog}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dead Letter Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('dashboard.deadLetterQueue')}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={deadLetterColumns}
            data={mockDeadLetters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
