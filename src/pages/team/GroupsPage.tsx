import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeamStore } from '@/store/team-store'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Plus, Trash2, Users } from 'lucide-react'

export default function GroupsPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { groups, createGroup, deleteGroup } = useTeamStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreate = () => {
    if (!name.trim()) return
    createGroup({
      id: `group-${Date.now()}`,
      name: name.trim(),
      nameZh: name.trim(),
      description: description.trim(),
      descriptionZh: description.trim(),
      memberIds: [],
      createdAt: new Date().toISOString(),
    })
    setName('')
    setDescription('')
    setDialogOpen(false)
  }

  return (
    <div>
      <PageHeader
        title={t('menu:groups')}
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
                <DialogTitle>{t('actions.create')} Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t('table.name')}</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('table.description')}</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                  />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {isZh ? group.nameZh : group.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => deleteGroup(group.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {isZh ? group.descriptionZh : group.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{group.memberIds.length} members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
