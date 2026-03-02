import type { Role } from '@/types/common'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Headset,
  Handshake,
  MessageSquare,
  UserCog,
  Zap,
  BarChart3,
  UserCircle,
  Shield,
  Settings,
  Monitor,
  User,
} from 'lucide-react'

export interface MenuItem {
  key: string
  icon: LucideIcon
  labelKey: string // i18n key from menu namespace
  path?: string
  children?: MenuItem[]
  roles: Role[]
}

export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
    labelKey: 'dashboard',
    path: '/dashboard',
    roles: ['sales', 'support', 'manager', 'admin'],
  },
  {
    key: 'client',
    icon: Users,
    labelKey: 'client',
    roles: ['sales', 'support', 'manager'],
    children: [
      {
        key: 'publicPool',
        icon: Users,
        labelKey: 'publicPool',
        path: '/client/public-pool',
        roles: ['sales', 'manager'],
      },
      {
        key: 'clients',
        icon: Users,
        labelKey: 'clients',
        path: '/client/list',
        roles: ['support', 'manager'],
      },
      {
        key: 'myClients',
        icon: Users,
        labelKey: 'myClients',
        path: '/client/my-clients',
        roles: ['sales'],
      },
    ],
  },
  {
    key: 'task',
    icon: ClipboardList,
    labelKey: 'task',
    roles: ['sales', 'support', 'manager'],
    children: [
      {
        key: 'myTasks',
        icon: ClipboardList,
        labelKey: 'myTasks',
        path: '/task/my-tasks',
        roles: ['sales', 'support', 'manager'],
      },
      {
        key: 'taskPool',
        icon: ClipboardList,
        labelKey: 'taskPool',
        path: '/task/pool',
        roles: ['sales', 'support', 'manager'],
      },
      {
        key: 'allTasks',
        icon: ClipboardList,
        labelKey: 'allTasks',
        path: '/task/all',
        roles: ['manager'],
      },
    ],
  },
  {
    key: 'ticket',
    icon: Headset,
    labelKey: 'ticket',
    roles: ['sales', 'support', 'manager'],
    children: [
      {
        key: 'myTickets',
        icon: Headset,
        labelKey: 'myTickets',
        path: '/ticket/my-tickets',
        roles: ['sales', 'support', 'manager'],
      },
      {
        key: 'allTickets',
        icon: Headset,
        labelKey: 'allTickets',
        path: '/ticket/all',
        roles: ['manager'],
      },
    ],
  },
  {
    key: 'ib',
    icon: Handshake,
    labelKey: 'ib',
    roles: ['sales', 'manager'],
    children: [
      {
        key: 'myIBDeals',
        icon: Handshake,
        labelKey: 'myIBDeals',
        path: '/ib/my-deals',
        roles: ['sales'],
      },
      {
        key: 'pendingApproval',
        icon: Handshake,
        labelKey: 'pendingApproval',
        path: '/ib/pending',
        roles: ['manager'],
      },
      {
        key: 'allIBDeals',
        icon: Handshake,
        labelKey: 'allIBDeals',
        path: '/ib/all',
        roles: ['manager'],
      },
    ],
  },
  {
    key: 'communication',
    icon: MessageSquare,
    labelKey: 'communication',
    path: '/communication',
    roles: ['support', 'manager'],
  },
  {
    key: 'team',
    icon: UserCog,
    labelKey: 'team',
    roles: ['manager'],
    children: [
      {
        key: 'teamMembers',
        icon: UserCog,
        labelKey: 'teamMembers',
        path: '/team/members',
        roles: ['manager'],
      },
      {
        key: 'groups',
        icon: UserCog,
        labelKey: 'groups',
        path: '/team/groups',
        roles: ['manager'],
      },
    ],
  },
  {
    key: 'automation',
    icon: Zap,
    labelKey: 'automation',
    path: '/automation',
    roles: ['manager', 'admin'],
  },
  {
    key: 'performance',
    icon: BarChart3,
    labelKey: 'performance',
    roles: ['sales', 'support', 'manager'],
    children: [
      {
        key: 'myPerformance',
        icon: BarChart3,
        labelKey: 'myPerformance',
        path: '/performance/my',
        roles: ['sales', 'support'],
      },
      {
        key: 'teamPerformance',
        icon: BarChart3,
        labelKey: 'teamPerformance',
        path: '/performance/team',
        roles: ['manager'],
      },
    ],
  },
  {
    key: 'user',
    icon: UserCircle,
    labelKey: 'user',
    roles: ['manager', 'admin'],
    children: [
      {
        key: 'userList',
        icon: UserCircle,
        labelKey: 'userList',
        path: '/user/list',
        roles: ['manager', 'admin'],
      },
    ],
  },
  {
    key: 'role',
    icon: Shield,
    labelKey: 'role',
    roles: ['admin'],
    children: [
      {
        key: 'roleList',
        icon: Shield,
        labelKey: 'roleList',
        path: '/role/list',
        roles: ['admin'],
      },
    ],
  },
  {
    key: 'systemSettings',
    icon: Settings,
    labelKey: 'systemSettings',
    path: '/settings',
    roles: ['admin'],
  },
  {
    key: 'systemMonitoring',
    icon: Monitor,
    labelKey: 'systemMonitoring',
    path: '/monitoring',
    roles: ['admin'],
  },
  {
    key: 'userProfile',
    icon: User,
    labelKey: 'userProfile',
    path: '/profile',
    roles: ['sales', 'support', 'manager', 'admin'],
  },
]

export function getMenuForRole(role: Role): MenuItem[] {
  return menuConfig
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) => child.roles.includes(role)),
        }
      }
      return item
    })
    .filter((item) => !item.children || item.children.length > 0)
}
