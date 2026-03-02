import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RoleBadge } from '@/components/common/RoleBadge'
import { Shield, Users, Headphones, Settings } from 'lucide-react'
import type { Role } from '@/types/common'

interface RoleInfo {
  role: Role
  icon: typeof Shield
  descriptionEn: string
  descriptionZh: string
  modules: string[]
}

const ROLE_INFO: RoleInfo[] = [
  {
    role: 'sales',
    icon: Users,
    descriptionEn: 'Acquire new clients, maintain relationships, manage IB deals',
    descriptionZh: '负责拉新，维护客户关系，管理IB协议',
    modules: [
      'Dashboard',
      'Public Pool',
      'My Clients',
      'My Tasks',
      'Task Pool',
      'My IB Deals',
      'Communication',
      'My Performance',
      'Profile',
    ],
  },
  {
    role: 'support',
    icon: Headphones,
    descriptionEn: 'Communicate with clients, resolve issues, handle tickets',
    descriptionZh: '与客户沟通，答疑解惑，解决问题，处理工单',
    modules: [
      'Dashboard',
      'My Clients',
      'My Tasks',
      'My Tickets',
      'Communication',
      'My Performance',
      'Profile',
    ],
  },
  {
    role: 'manager',
    icon: Shield,
    descriptionEn: 'Manage Sales and Support teams, review performance, approve IB deals',
    descriptionZh: '管理Sales/Support团队，审核绩效，审批IB协议',
    modules: [
      'Dashboard',
      'Clients',
      'All Tasks',
      'All Tickets',
      'All IB Deals',
      'Pending Approval',
      'Team Members',
      'Groups',
      'Automation',
      'Team Performance',
      'Profile',
    ],
  },
  {
    role: 'admin',
    icon: Settings,
    descriptionEn: 'System configuration, user and role management, monitoring',
    descriptionZh: '系统配置，用户和角色管理，系统监控',
    modules: [
      'Dashboard',
      'User Management',
      'Role Management',
      'System Settings',
      'System Monitoring',
      'Automation',
      'Profile',
    ],
  },
]

export default function RoleListPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div>
      <PageHeader title={t('menu:roleList')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROLE_INFO.map(({ role, icon: Icon, descriptionEn, descriptionZh, modules }) => (
          <Card key={role}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RoleBadge role={role} />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isZh ? descriptionZh : descriptionEn}
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Accessible Modules:</p>
                <div className="flex flex-wrap gap-1.5">
                  {modules.map((mod) => (
                    <Badge key={mod} variant="secondary" className="text-xs">
                      {mod}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
