export interface Condition {
  field: string
  fieldLabel: string
  operator: string
  value: string
  valueLabel: string
}

export interface ConditionGroup {
  logic: 'AND' | 'OR'
  conditions: Condition[]
}

export interface RuleAction {
  type: string
  typeLabel: string
  config: Record<string, string>
}

export interface AutomationRule {
  id: string
  name: string
  nameZh: string
  enabled: boolean
  triggerType: 'event' | 'scheduled' | 'both'
  conditions: ConditionGroup[]
  actions: RuleAction[]
  createdBy: string
  createdAt: string
  lastModified: string
}

export const mockAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Chinese KYC Approved Auto-Assign',
    nameZh: '中国客户KYC通过自动分配',
    enabled: true,
    triggerType: 'event',
    conditions: [
      {
        logic: 'AND',
        conditions: [
          {
            field: 'event.type',
            fieldLabel: 'Event Type',
            operator: 'equals',
            value: 'client.kyc_approved',
            valueLabel: 'KYC Approved',
          },
          {
            field: 'client.country',
            fieldLabel: 'Client Country',
            operator: 'equals',
            value: 'CN',
            valueLabel: 'China',
          },
          {
            field: 'client.language',
            fieldLabel: 'Client Language',
            operator: 'equals',
            value: 'zh_cn',
            valueLabel: 'Chinese (Simplified)',
          },
        ],
      },
    ],
    actions: [
      {
        type: 'assign_by_language_region',
        typeLabel: 'Assign by Language & Region',
        config: {
          language: 'zh_cn',
          region: 'asia',
          fallbackUserId: 'user-sales-2',
          fallbackUserName: 'Li Wei',
        },
      },
      {
        type: 'create_task',
        typeLabel: 'Create Task',
        config: {
          taskType: 'deposit_guidance',
          taskTitle: 'Deposit Guidance for New KYC-Approved Client',
          priority: 'high',
          dueDays: '3',
          description:
            'Guide the newly KYC-approved Chinese client through the deposit process. Provide payment method options and assist with any questions.',
        },
      },
    ],
    createdBy: 'user-admin-1',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-02-20T14:30:00Z',
  },
  {
    id: 'rule-2',
    name: 'High Priority Task Notification',
    nameZh: '高优先级任务通知',
    enabled: true,
    triggerType: 'event',
    conditions: [
      {
        logic: 'OR',
        conditions: [
          {
            field: 'task.priority',
            fieldLabel: 'Task Priority',
            operator: 'equals',
            value: 'high',
            valueLabel: 'High',
          },
          {
            field: 'task.priority',
            fieldLabel: 'Task Priority',
            operator: 'equals',
            value: 'urgent',
            valueLabel: 'Urgent',
          },
        ],
      },
    ],
    actions: [
      {
        type: 'notify_manager',
        typeLabel: 'Notify Manager',
        config: {
          notificationChannel: 'in_app',
          message:
            'A high/urgent priority task has been created and requires immediate attention.',
          includeTaskLink: 'true',
        },
      },
    ],
    createdBy: 'user-admin-1',
    createdAt: '2026-01-20T10:00:00Z',
    lastModified: '2026-02-18T11:15:00Z',
  },
  {
    id: 'rule-3',
    name: 'Client Dormancy Detection',
    nameZh: '客户休眠检测',
    enabled: true,
    triggerType: 'scheduled',
    conditions: [
      {
        logic: 'AND',
        conditions: [
          {
            field: 'client.lastActivityDays',
            fieldLabel: 'Days Since Last Activity',
            operator: 'greater_than',
            value: '30',
            valueLabel: '30 days',
          },
          {
            field: 'client.status',
            fieldLabel: 'Client Status',
            operator: 'not_equals',
            value: 'dormant',
            valueLabel: 'Dormant',
          },
        ],
      },
    ],
    actions: [
      {
        type: 'update_client_status',
        typeLabel: 'Update Client Status',
        config: {
          newStatus: 'dormant',
          reason: 'No activity for over 30 days (automated detection)',
        },
      },
      {
        type: 'create_task',
        typeLabel: 'Create Task',
        config: {
          taskType: 'reactivation',
          taskTitle: 'Client Reactivation Outreach',
          priority: 'medium',
          dueDays: '7',
          description:
            'Client has been inactive for over 30 days. Reach out to understand their situation and encourage re-engagement with available promotions or new products.',
        },
      },
    ],
    createdBy: 'user-admin-1',
    createdAt: '2026-01-10T08:30:00Z',
    lastModified: '2026-02-25T09:00:00Z',
  },
  {
    id: 'rule-4',
    name: 'No Response Retry',
    nameZh: '无回复自动重试',
    enabled: true,
    triggerType: 'scheduled',
    conditions: [
      {
        logic: 'AND',
        conditions: [
          {
            field: 'task.status',
            fieldLabel: 'Task Status',
            operator: 'equals',
            value: 'no_response',
            valueLabel: 'No Response',
          },
          {
            field: 'task.retryCount',
            fieldLabel: 'Retry Count',
            operator: 'less_than',
            value: '3',
            valueLabel: '3 retries',
          },
          {
            field: 'task.lastRetryInterval',
            fieldLabel: 'Days Since Last Retry',
            operator: 'greater_than_or_equal',
            value: '2',
            valueLabel: '2 days',
          },
        ],
      },
    ],
    actions: [
      {
        type: 'create_task',
        typeLabel: 'Create Follow-Up Task',
        config: {
          taskType: 'follow_up',
          taskTitle: 'Retry: Follow Up with Unresponsive Client',
          priority: 'medium',
          dueDays: '1',
          copyAssignee: 'true',
          incrementRetryCount: 'true',
          description:
            'Automated retry attempt. Previous outreach received no response. Try an alternative contact method or adjust messaging.',
        },
      },
    ],
    createdBy: 'user-admin-1',
    createdAt: '2026-02-01T10:00:00Z',
    lastModified: '2026-02-28T16:45:00Z',
  },
  {
    id: 'rule-5',
    name: 'IB Deal Expired Follow-Up',
    nameZh: 'IB协议到期跟进',
    enabled: true,
    triggerType: 'event',
    conditions: [
      {
        logic: 'AND',
        conditions: [
          {
            field: 'event.type',
            fieldLabel: 'Event Type',
            operator: 'equals',
            value: 'ib.deal_expired',
            valueLabel: 'IB Deal Expired',
          },
        ],
      },
    ],
    actions: [
      {
        type: 'create_task',
        typeLabel: 'Create Task',
        config: {
          taskType: 'ib_renewal_followup',
          taskTitle: 'IB Deal Renewal Follow-Up',
          priority: 'high',
          dueDays: '2',
          assignToOriginalOwner: 'true',
          description:
            'The IB partnership deal has expired. Contact the IB partner to discuss renewal terms, review performance metrics, and negotiate updated commission structures.',
        },
      },
      {
        type: 'notify_manager',
        typeLabel: 'Notify Manager',
        config: {
          notificationChannel: 'in_app',
          message:
            'An IB deal has expired and a renewal follow-up task has been created. Please review the partnership status.',
          includeIBDetails: 'true',
        },
      },
    ],
    createdBy: 'user-admin-1',
    createdAt: '2026-02-05T11:00:00Z',
    lastModified: '2026-02-27T13:20:00Z',
  },
  {
    id: 'rule-6',
    name: 'IB Application Ticket Routing',
    nameZh: 'IB申请工单路由',
    enabled: true,
    triggerType: 'event',
    conditions: [
      {
        logic: 'AND',
        conditions: [
          {
            field: 'event.type',
            fieldLabel: 'Event Type',
            operator: 'equals',
            value: 'ticket.created',
            valueLabel: 'Ticket Created',
          },
          {
            field: 'ticket.category',
            fieldLabel: 'Ticket Category',
            operator: 'equals',
            value: 'ib_application',
            valueLabel: 'IB Application',
          },
        ],
      },
    ],
    actions: [
      {
        type: 'assign_to_group',
        typeLabel: 'Assign to Group',
        config: {
          groupId: 'group-2',
          groupName: 'IB Support Group',
          assignmentStrategy: 'round_robin',
          notifyGroup: 'true',
        },
      },
    ],
    createdBy: 'user-admin-1',
    createdAt: '2026-02-10T09:30:00Z',
    lastModified: '2026-02-26T10:00:00Z',
  },
]
