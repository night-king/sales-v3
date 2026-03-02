import type { Role } from '@/types/common'

type Action = 'view' | 'create' | 'edit' | 'delete' | 'assign' | 'claim' | 'release' | 'escalate' | 'approve' | 'toggle'

type Module =
  | 'publicPool' | 'clients' | 'myClients' | 'clientDetail'
  | 'myTasks' | 'taskPool' | 'allTasks'
  | 'myTickets' | 'allTickets'
  | 'myIBDeals' | 'pendingApproval' | 'allIBDeals'
  | 'communication'
  | 'teamMembers' | 'groups'
  | 'automation'
  | 'myPerformance' | 'teamPerformance'
  | 'userList'
  | 'roleList'
  | 'systemSettings' | 'systemMonitoring'
  | 'userProfile'

const P: Record<Role, Partial<Record<Module, Action[]>>> = {
  sales: {
    publicPool: ['view', 'claim', 'create'],
    myClients: ['view', 'edit', 'release', 'delete'],
    clientDetail: ['view', 'edit'],
    myTasks: ['view', 'claim'],
    taskPool: ['view', 'claim'],
    myTickets: ['view', 'create', 'escalate'],
    myIBDeals: ['view', 'create', 'edit'],
    myPerformance: ['view'],
    userProfile: ['view', 'edit'],
  },
  support: {
    clients: ['view'],
    clientDetail: ['view'],
    myTasks: ['view', 'claim'],
    taskPool: ['view', 'claim'],
    myTickets: ['view', 'create', 'escalate'],
    communication: ['view', 'create'],
    myPerformance: ['view'],
    userProfile: ['view', 'edit'],
  },
  manager: {
    publicPool: ['view', 'claim', 'create', 'assign'],
    clients: ['view', 'edit'],
    clientDetail: ['view', 'edit'],
    myTasks: ['view', 'claim'],
    taskPool: ['view', 'claim'],
    allTasks: ['view', 'create', 'assign'],
    myTickets: ['view', 'create', 'escalate'],
    allTickets: ['view', 'create', 'assign'],
    pendingApproval: ['view', 'approve'],
    allIBDeals: ['view', 'create', 'edit'],
    communication: ['view', 'create'],
    teamMembers: ['view', 'edit'],
    groups: ['view', 'create', 'edit', 'delete'],
    automation: ['view', 'create', 'edit', 'delete', 'toggle'],
    teamPerformance: ['view'],
    userList: ['view', 'create', 'edit'],
    userProfile: ['view', 'edit'],
  },
  admin: {
    automation: ['view'],
    userList: ['view', 'create', 'edit'],
    roleList: ['view', 'create', 'edit'],
    systemSettings: ['view', 'edit'],
    systemMonitoring: ['view'],
    userProfile: ['view', 'edit'],
  },
}

export function hasPermission(role: Role, module: Module, action: Action): boolean {
  return P[role]?.[module]?.includes(action) ?? false
}

export function getModuleActions(role: Role, module: Module): Action[] {
  return P[role]?.[module] ?? []
}

export type { Module, Action }
