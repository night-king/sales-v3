import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { mockUsers } from '@/data/users'
import { DataTable } from '@/components/data-table/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleBadge } from '@/components/common/RoleBadge'
import { Badge } from '@/components/ui/badge'
import { USER_STATUSES, LANGUAGES, REGIONS } from '@/lib/constants'
import type { User } from '@/types/user'

export default function TeamMembersPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
    },
    {
      accessorKey: 'role',
      header: t('role', { ns: 'menu' }),
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        const status = USER_STATUSES.find((s) => s.value === row.original.status)
        return (
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status?.dotColor ?? 'bg-gray-400'}`} />
            <span>{isZh ? status?.labelZh : status?.labelEn}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'languages',
      header: t('table.language'),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.languages.map((lang) => {
            const langInfo = LANGUAGES.find((l) => l.value === lang)
            return (
              <Badge key={lang} variant="secondary" className="text-xs">
                {langInfo?.label ?? lang}
              </Badge>
            )
          })}
        </div>
      ),
    },
    {
      id: 'regions',
      header: t('region.asia', { defaultValue: 'Regions' }),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.regions.map((region) => {
            const regionInfo = REGIONS.find((r) => r.value === region)
            return (
              <Badge key={region} variant="outline" className="text-xs">
                {isZh ? regionInfo?.labelZh : regionInfo?.labelEn}
              </Badge>
            )
          })}
        </div>
      ),
    },
    {
      id: 'skills',
      header: 'Skills',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.original.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill.replace(/_/g, ' ')}
            </Badge>
          ))}
          {row.original.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.skills.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={t('menu:teamMembers')} />
      <DataTable
        columns={columns}
        data={mockUsers}
        searchColumn="name"
        searchPlaceholder={t('actions.search')}
        filters={[
          {
            columnId: 'role',
            label: t('menu:role'),
            options: [
              { value: 'sales', label: t('roles.sales') },
              { value: 'support', label: t('roles.support') },
              { value: 'manager', label: t('roles.manager') },
              { value: 'admin', label: t('roles.admin') },
            ],
          },
          {
            columnId: 'status',
            label: t('table.status'),
            options: USER_STATUSES.map((s) => ({
              value: s.value,
              label: isZh ? s.labelZh : s.labelEn,
            })),
          },
        ]}
      />
    </div>
  )
}
