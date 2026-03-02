import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { mockUsers } from '@/data/users'
import { DataTable } from '@/components/data-table/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleBadge } from '@/components/common/RoleBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { USER_STATUSES, LANGUAGES, REGIONS, ROLES } from '@/lib/constants'
import type { User } from '@/types/user'
import type { Role, UserStatus } from '@/types/common'

export default function UserListPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<Role>('sales')
  const [newStatus, setNewStatus] = useState<UserStatus>('active')

  const handleCreate = () => {
    if (!newName.trim() || !newEmail.trim()) return
    // Demo only - just close dialog
    alert(`User "${newName}" created (demo only)`)
    setNewName('')
    setNewEmail('')
    setNewRole('sales')
    setNewStatus('active')
    setDialogOpen(false)
  }

  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: t('table.email'),
    },
    {
      accessorKey: 'role',
      header: t('menu:role'),
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
      header: 'Regions',
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
      accessorKey: 'maxTaskCapacity',
      header: 'Max Tasks',
    },
    {
      id: 'skills',
      header: 'Skills',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.original.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill.replace(/_/g, ' ')}
            </Badge>
          ))}
          {row.original.skills.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.skills.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('menu:userList')}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('actions.create')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('table.name')}</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('table.email')}</Label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('menu:role')}</Label>
                  <Select
                    value={newRole}
                    onValueChange={(v) => setNewRole(v as Role)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {isZh ? r.labelZh : r.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('table.status')}</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(v) => setNewStatus(v as UserStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {isZh ? s.labelZh : s.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t('actions.cancel')}</Button>
                </DialogClose>
                <Button onClick={handleCreate}>{t('actions.create')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        columns={columns}
        data={mockUsers}
        searchColumn="name"
        searchPlaceholder={t('actions.search')}
        filters={[
          {
            columnId: 'role',
            label: t('menu:role'),
            options: ROLES.map((r) => ({
              value: r.value,
              label: isZh ? r.labelZh : r.labelEn,
            })),
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
