export interface SalesPerformance {
  userId: string
  userName: string
  period: 'week' | 'month' | 'quarter'
  newClients: number
  registrationConversionRate: number
  depositConversionRate: number
  totalDepositAmount: number
  avgClientValue: number
  ibDealsCreated: number
  taskCompletionRate: number
}

export interface SupportPerformance {
  userId: string
  userName: string
  period: 'week' | 'month' | 'quarter'
  totalTickets: number
  pendingTickets: number
  avgResolutionTime: number // hours
  firstResponseTime: number // minutes
  resolutionRate: number
  escalationRate: number
}

export interface FunnelData {
  stage: string
  stageZh: string
  count: number
}

export interface PerformanceData {
  salesPerformance: SalesPerformance[]
  supportPerformance: SupportPerformance[]
  funnel: FunnelData[]
}

export const mockPerformance: PerformanceData = {
  salesPerformance: [
    // James Wilson - week
    {
      userId: 'user-sales-1',
      userName: 'James Wilson',
      period: 'week',
      newClients: 3,
      registrationConversionRate: 0.42,
      depositConversionRate: 0.35,
      totalDepositAmount: 18500,
      avgClientValue: 6166,
      ibDealsCreated: 1,
      taskCompletionRate: 0.88,
    },
    // James Wilson - month
    {
      userId: 'user-sales-1',
      userName: 'James Wilson',
      period: 'month',
      newClients: 12,
      registrationConversionRate: 0.45,
      depositConversionRate: 0.38,
      totalDepositAmount: 82000,
      avgClientValue: 6833,
      ibDealsCreated: 3,
      taskCompletionRate: 0.91,
    },
    // James Wilson - quarter
    {
      userId: 'user-sales-1',
      userName: 'James Wilson',
      period: 'quarter',
      newClients: 34,
      registrationConversionRate: 0.43,
      depositConversionRate: 0.36,
      totalDepositAmount: 245000,
      avgClientValue: 7206,
      ibDealsCreated: 8,
      taskCompletionRate: 0.89,
    },
    // Li Wei - week
    {
      userId: 'user-sales-2',
      userName: 'Li Wei',
      period: 'week',
      newClients: 5,
      registrationConversionRate: 0.52,
      depositConversionRate: 0.40,
      totalDepositAmount: 24000,
      avgClientValue: 4800,
      ibDealsCreated: 2,
      taskCompletionRate: 0.92,
    },
    // Li Wei - month
    {
      userId: 'user-sales-2',
      userName: 'Li Wei',
      period: 'month',
      newClients: 18,
      registrationConversionRate: 0.50,
      depositConversionRate: 0.42,
      totalDepositAmount: 95000,
      avgClientValue: 5278,
      ibDealsCreated: 5,
      taskCompletionRate: 0.94,
    },
    // Li Wei - quarter
    {
      userId: 'user-sales-2',
      userName: 'Li Wei',
      period: 'quarter',
      newClients: 48,
      registrationConversionRate: 0.48,
      depositConversionRate: 0.39,
      totalDepositAmount: 278000,
      avgClientValue: 5792,
      ibDealsCreated: 12,
      taskCompletionRate: 0.93,
    },
    // Yuki Tanaka - week
    {
      userId: 'user-sales-3',
      userName: 'Yuki Tanaka',
      period: 'week',
      newClients: 2,
      registrationConversionRate: 0.38,
      depositConversionRate: 0.30,
      totalDepositAmount: 12000,
      avgClientValue: 6000,
      ibDealsCreated: 0,
      taskCompletionRate: 0.85,
    },
    // Yuki Tanaka - month
    {
      userId: 'user-sales-3',
      userName: 'Yuki Tanaka',
      period: 'month',
      newClients: 9,
      registrationConversionRate: 0.40,
      depositConversionRate: 0.33,
      totalDepositAmount: 56000,
      avgClientValue: 6222,
      ibDealsCreated: 2,
      taskCompletionRate: 0.87,
    },
    // Yuki Tanaka - quarter
    {
      userId: 'user-sales-3',
      userName: 'Yuki Tanaka',
      period: 'quarter',
      newClients: 25,
      registrationConversionRate: 0.39,
      depositConversionRate: 0.31,
      totalDepositAmount: 162000,
      avgClientValue: 6480,
      ibDealsCreated: 5,
      taskCompletionRate: 0.86,
    },
  ],
  supportPerformance: [
    // Maria Santos - week
    {
      userId: 'user-support-1',
      userName: 'Maria Santos',
      period: 'week',
      totalTickets: 28,
      pendingTickets: 4,
      avgResolutionTime: 3.2,
      firstResponseTime: 12,
      resolutionRate: 0.86,
      escalationRate: 0.07,
    },
    // Maria Santos - month
    {
      userId: 'user-support-1',
      userName: 'Maria Santos',
      period: 'month',
      totalTickets: 112,
      pendingTickets: 8,
      avgResolutionTime: 4.1,
      firstResponseTime: 15,
      resolutionRate: 0.88,
      escalationRate: 0.06,
    },
    // Maria Santos - quarter
    {
      userId: 'user-support-1',
      userName: 'Maria Santos',
      period: 'quarter',
      totalTickets: 320,
      pendingTickets: 12,
      avgResolutionTime: 3.8,
      firstResponseTime: 14,
      resolutionRate: 0.87,
      escalationRate: 0.065,
    },
    // Chen Mei - week
    {
      userId: 'user-support-2',
      userName: 'Chen Mei',
      period: 'week',
      totalTickets: 35,
      pendingTickets: 6,
      avgResolutionTime: 2.8,
      firstResponseTime: 8,
      resolutionRate: 0.91,
      escalationRate: 0.04,
    },
    // Chen Mei - month
    {
      userId: 'user-support-2',
      userName: 'Chen Mei',
      period: 'month',
      totalTickets: 138,
      pendingTickets: 10,
      avgResolutionTime: 3.0,
      firstResponseTime: 10,
      resolutionRate: 0.92,
      escalationRate: 0.05,
    },
    // Chen Mei - quarter
    {
      userId: 'user-support-2',
      userName: 'Chen Mei',
      period: 'quarter',
      totalTickets: 395,
      pendingTickets: 15,
      avgResolutionTime: 2.9,
      firstResponseTime: 9,
      resolutionRate: 0.91,
      escalationRate: 0.045,
    },
    // Park Jihoon - week
    {
      userId: 'user-support-3',
      userName: 'Park Jihoon',
      period: 'week',
      totalTickets: 22,
      pendingTickets: 3,
      avgResolutionTime: 4.5,
      firstResponseTime: 18,
      resolutionRate: 0.82,
      escalationRate: 0.09,
    },
    // Park Jihoon - month
    {
      userId: 'user-support-3',
      userName: 'Park Jihoon',
      period: 'month',
      totalTickets: 89,
      pendingTickets: 7,
      avgResolutionTime: 4.8,
      firstResponseTime: 20,
      resolutionRate: 0.84,
      escalationRate: 0.08,
    },
    // Park Jihoon - quarter
    {
      userId: 'user-support-3',
      userName: 'Park Jihoon',
      period: 'quarter',
      totalTickets: 258,
      pendingTickets: 10,
      avgResolutionTime: 4.6,
      firstResponseTime: 19,
      resolutionRate: 0.83,
      escalationRate: 0.085,
    },
  ],
  funnel: [
    {
      stage: 'Lead',
      stageZh: '潜在客户',
      count: 35,
    },
    {
      stage: 'Registered',
      stageZh: '已注册',
      count: 29,
    },
    {
      stage: 'KYC Approved',
      stageZh: 'KYC已通过',
      count: 20,
    },
    {
      stage: 'Funded',
      stageZh: '已入金',
      count: 15,
    },
    {
      stage: 'Active',
      stageZh: '活跃交易',
      count: 10,
    },
  ],
}
