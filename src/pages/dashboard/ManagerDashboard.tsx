import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClientStore } from '@/store/client-store'
import { useTicketStore } from '@/store/ticket-store'
import { useIBStore } from '@/store/ib-store'
import { useAutomationStore } from '@/store/automation-store'
import { mockUsers } from '@/data/users'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, Handshake, Headset, UserCog, Zap } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CLIENT_STATUSES } from '@/lib/constants'

const PIE_COLORS = ['#94a3b8', '#60a5fa', '#facc15', '#f87171', '#4ade80', '#34d399', '#2dd4bf', '#fb923c']

export function ManagerDashboard() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const clients = useClientStore((s) => s.clients)
  const tickets = useTicketStore((s) => s.tickets)
  const ibDeals = useIBStore((s) => s.ibDeals)
  const rules = useAutomationStore((s) => s.rules)

  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.status === 'active').length
  const pendingIB = ibDeals.filter((d) => d.status === 'pending_approval').length
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length
  const teamMembers = mockUsers.filter((u) => u.role === 'sales' || u.role === 'support').length
  const activeRules = rules.filter((r) => r.enabled).length

  // Client lifecycle pie data
  const pieData = CLIENT_STATUSES.map((s) => ({
    name: i18n.language === 'zh' ? s.labelZh : s.labelEn,
    value: clients.filter((c) => c.status === s.value).length,
  })).filter((d) => d.value > 0)

  return (
    <div>
      <PageHeader title={t('menu:dashboard')} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title={t('dashboard.totalClients')}
          value={totalClients}
          icon={Users}
          onClick={() => navigate('/client/list')}
        />
        <StatCard
          title={t('dashboard.activeClients')}
          value={activeClients}
          icon={UserCheck}
          onClick={() => navigate('/client/list')}
        />
        <StatCard
          title={t('dashboard.pendingIB')}
          value={pendingIB}
          icon={Handshake}
          onClick={() => navigate('/ib/pending')}
        />
        <StatCard
          title={t('dashboard.openTickets')}
          value={openTickets}
          icon={Headset}
          onClick={() => navigate('/ticket/all')}
        />
        <StatCard
          title={t('dashboard.teamMembers')}
          value={teamMembers}
          icon={UserCog}
          onClick={() => navigate('/team/members')}
        />
        <StatCard
          title={t('dashboard.activeRules')}
          value={activeRules}
          icon={Zap}
          onClick={() => navigate('/automation')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.clientLifecycle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.teamOverview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">{t('roles.sales')}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-md bg-muted">
                    <p className="text-muted-foreground">{t('dashboard.newClients')}</p>
                    <p className="text-lg font-semibold">12</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted">
                    <p className="text-muted-foreground">{t('dashboard.conversionRate')}</p>
                    <p className="text-lg font-semibold">34%</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">{t('roles.support')}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-md bg-muted">
                    <p className="text-muted-foreground">{t('dashboard.ticketCount')}</p>
                    <p className="text-lg font-semibold">{tickets.length}</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted">
                    <p className="text-muted-foreground">{t('dashboard.resolutionRate')}</p>
                    <p className="text-lg font-semibold">78%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
