import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTaskStore } from '@/store/task-store'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { TaskTable } from './components/TaskTable'
import { TaskDetailDrawer } from './components/TaskDetailDrawer'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TASK_TYPES, PRIORITIES } from '@/lib/constants'
import type { Task } from '@/types/task'
import type { TaskType } from '@/types/task'
import type { Priority } from '@/types/common'

export default function AllTasksPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const currentUser = useAuthStore((s) => s.currentUser)
  const tasks = useTaskStore((s) => s.tasks)
  const createTask = useTaskStore((s) => s.createTask)
  const clients = useClientStore((s) => s.clients)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Create task form state
  const [newType, setNewType] = useState<TaskType | ''>('')
  const [newPriority, setNewPriority] = useState<Priority | ''>('')
  const [newClientId, setNewClientId] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const resetForm = () => {
    setNewType('')
    setNewPriority('')
    setNewClientId('')
    setNewDescription('')
  }

  const handleCreateTask = () => {
    if (!newType || !newPriority || !newClientId || !currentUser) return

    const task: Task = {
      id: `task-${Date.now()}`,
      type: newType,
      priority: newPriority,
      status: 'pending',
      clientId: newClientId,
      createdBy: currentUser.id,
      assignedTo: undefined,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      retryCount: 0,
      maxRetries: 3,
      description: newDescription || undefined,
      communicationLogs: [],
    }

    createTask(task)
    resetForm()
    setDialogOpen(false)
  }

  const isFormValid = newType && newPriority && newClientId

  return (
    <div>
      <PageHeader
        title={t('menu:allTasks')}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('actions.createTask')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('actions.createTask')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Task Type */}
                <div className="space-y-2">
                  <Label>{t('table.type')}</Label>
                  <Select
                    value={newType}
                    onValueChange={(val) => setNewType(val as TaskType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map((tt) => (
                        <SelectItem key={tt.value} value={tt.value}>
                          {isZh ? tt.labelZh : tt.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>{t('table.priority')}</Label>
                  <Select
                    value={newPriority}
                    onValueChange={(val) => setNewPriority(val as Priority)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {isZh ? p.labelZh : p.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label>{t('table.client')}</Label>
                  <Select
                    value={newClientId}
                    onValueChange={setNewClientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>{t('table.description')}</Label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false) }}>
                    {t('actions.cancel')}
                  </Button>
                  <Button onClick={handleCreateTask} disabled={!isFormValid}>
                    {t('actions.create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <TaskTable data={tasks} onRowClick={handleRowClick} />
      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
