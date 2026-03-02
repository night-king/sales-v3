import type { Notification } from '@/types/common'

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'task',
    title: 'New Task Assigned: Deposit Guidance',
    description:
      'You have been assigned a new high-priority task: "Deposit Guidance for Wang Xiaoming." KYC was recently approved. Please follow up within 3 days.',
    timestamp: '2026-03-02T10:30:00Z',
    read: false,
    link: '/tasks/task-101',
  },
  {
    id: 'notif-2',
    type: 'ticket',
    title: 'Ticket Escalated: Account Locked',
    description:
      'Ticket #TK-2089 (Maria Garcia - Account Locked) has been escalated to Level 2 support. Client has open positions and requires urgent resolution.',
    timestamp: '2026-03-02T09:15:00Z',
    read: false,
    link: '/tickets/TK-2089',
  },
  {
    id: 'notif-3',
    type: 'ib',
    title: 'IB Application Approved',
    description:
      'Robert Taylor\'s IB application (IB-5032) has been approved. Standard commission tier assigned. Partnership agreement is pending signature.',
    timestamp: '2026-03-02T08:00:00Z',
    read: false,
    link: '/ib/IB-5032',
  },
  {
    id: 'notif-4',
    type: 'client',
    title: 'Client Status Changed: Dormant',
    description:
      'Client "Michael Chen" (client-14) has been automatically marked as Dormant due to 30+ days of inactivity. A reactivation task has been created.',
    timestamp: '2026-03-02T06:00:00Z',
    read: false,
    link: '/clients/client-14',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Scheduled Maintenance: MT5 Server',
    description:
      'MT5 Asia server maintenance scheduled for March 3, 2026 at 23:00-23:30 JST. Clients may experience brief disconnections. Please inform affected clients.',
    timestamp: '2026-03-02T05:00:00Z',
    read: true,
    link: '/system/announcements',
  },
  {
    id: 'notif-6',
    type: 'task',
    title: 'Task Overdue: Client Reactivation',
    description:
      'Task "Reactivation Outreach for Chen Jiayi" is now overdue. Originally due on March 1. Please complete or request an extension.',
    timestamp: '2026-03-02T00:00:00Z',
    read: false,
    link: '/tasks/task-088',
  },
  {
    id: 'notif-7',
    type: 'ib',
    title: 'IB Deal Expiring Soon',
    description:
      'Zhang Wei\'s IB partnership deal (IB-3021) expires on March 10, 2026. Commission tier: Premium. Please initiate renewal discussion.',
    timestamp: '2026-03-01T14:00:00Z',
    read: true,
    link: '/ib/IB-3021',
  },
  {
    id: 'notif-8',
    type: 'ticket',
    title: 'New Ticket: KYC Document Rejection',
    description:
      'Ticket #TK-2091 created by Huang Mei-ling regarding corporate KYC rejection. Category: KYC/Verification. Priority: Medium.',
    timestamp: '2026-03-01T12:30:00Z',
    read: true,
    link: '/tickets/TK-2091',
  },
  {
    id: 'notif-9',
    type: 'client',
    title: 'New VIP Client Qualified',
    description:
      'Client "David Brown" (client-19) now meets VIP criteria: account balance $52,000 and average monthly volume 110 lots. Consider upgrading to VIP tier.',
    timestamp: '2026-03-01T10:00:00Z',
    read: true,
    link: '/clients/client-19',
  },
  {
    id: 'notif-10',
    type: 'task',
    title: 'Task Completed: IB Commission Review',
    description:
      'Chen Mei has completed the task "IB Commission Discrepancy Review" for Priya Patel (IB-4521). Adjusted amount of $127.40 has been credited.',
    timestamp: '2026-03-01T08:00:00Z',
    read: true,
    link: '/tasks/task-092',
  },
  {
    id: 'notif-11',
    type: 'system',
    title: 'New Deposit Promotion Launched',
    description:
      '20% deposit bonus promotion is now active (March 1 - March 31, 2026). Minimum deposit: $500, maximum bonus: $2,000. Update your client communications accordingly.',
    timestamp: '2026-03-01T00:00:00Z',
    read: true,
    link: '/system/promotions',
  },
  {
    id: 'notif-12',
    type: 'ib',
    title: 'IB Application Rejected',
    description:
      'IB application (IB-5028) for "Alex Petrov" has been rejected. Reason: Insufficient marketing plan documentation. The applicant may reapply with updated materials.',
    timestamp: '2026-02-28T16:00:00Z',
    read: true,
    link: '/ib/IB-5028',
  },
  {
    id: 'notif-13',
    type: 'ticket',
    title: 'Ticket SLA Warning: Withdrawal Delay',
    description:
      'Ticket #TK-2085 (Kim Soo-jin - Withdrawal Delay) is approaching the 24-hour SLA threshold. Current wait time: 20 hours. Please prioritize resolution.',
    timestamp: '2026-02-28T14:00:00Z',
    read: true,
    link: '/tickets/TK-2085',
  },
  {
    id: 'notif-14',
    type: 'client',
    title: 'Large Deposit Detected',
    description:
      'Client "Chen Jiayi" (client-21) has deposited $25,000 via bank wire transfer. This exceeds the $10,000 threshold. Compliance review may be required.',
    timestamp: '2026-02-28T11:30:00Z',
    read: true,
    link: '/clients/client-21',
  },
  {
    id: 'notif-15',
    type: 'system',
    title: 'Automation Rule Updated',
    description:
      'Automation rule "No Response Retry" (rule-4) has been modified by the admin. Retry interval changed from 3 days to 2 days. Maximum retries remain at 3.',
    timestamp: '2026-02-28T10:00:00Z',
    read: true,
    link: '/settings/automation/rule-4',
  },
]
