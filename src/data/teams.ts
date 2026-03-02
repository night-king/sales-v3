export interface Group {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  memberIds: string[]
  createdAt: string
}

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'China Sales Group',
    nameZh: '中国销售组',
    description:
      'Dedicated sales team for the China region. Handles Chinese-speaking clients across mainland China, Hong Kong, and Taiwan.',
    descriptionZh:
      '专注中国区域的销售团队，负责中国大陆、香港及台湾的中文客户服务。',
    memberIds: ['user-sales-2', 'user-sales-3', 'user-support-2'],
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'group-2',
    name: 'IB Support Group',
    nameZh: 'IB支持组',
    description:
      'Handles all Introducing Broker (IB) related inquiries, applications, deal management, and commission disputes.',
    descriptionZh:
      '处理所有介绍经纪人(IB)相关的咨询、申请、协议管理及佣金争议。',
    memberIds: ['user-support-1', 'user-support-2'],
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'group-3',
    name: 'KYC Expert Group',
    nameZh: 'KYC专家组',
    description:
      'Specialized team for KYC verification, document review, compliance checks, and identity verification escalations.',
    descriptionZh: 'KYC验证专业团队，负责文件审核、合规检查及身份验证升级处理。',
    memberIds: ['user-support-2', 'user-support-3'],
    createdAt: '2025-12-01T09:00:00Z',
  },
  {
    id: 'group-4',
    name: 'VIP Service Group',
    nameZh: 'VIP服务组',
    description:
      'Premium service team for high-value clients. Provides dedicated account management, priority support, and exclusive offers.',
    descriptionZh:
      '高价值客户的优质服务团队，提供专属客户管理、优先支持及独家优惠。',
    memberIds: ['user-sales-1', 'user-support-1'],
    createdAt: '2025-12-15T11:00:00Z',
  },
]
