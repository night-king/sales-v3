import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTaskStore } from '@/store/task-store'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { TaskTable } from './components/TaskTable'
import { TaskDetailDrawer } from './components/TaskDetailDrawer'
import type { Task } from '@/types/task'

export default function TaskPoolPage() {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const tasks = useTaskStore((s) => s.tasks)
  const claimTask = useTaskStore((s) => s.claimTask)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const poolTasks = tasks.filter((task) => !task.assignedTo)

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const handleClaim = (task: Task) => {
    if (currentUser?.id) {
      claimTask(task.id, currentUser.id)
    }
  }

  return (
    <div>
      <PageHeader title={t('menu:taskPool')} />
      <TaskTable
        data={poolTasks}
        onRowClick={handleRowClick}
        actions={(task) => (
          <Button size="sm" onClick={() => handleClaim(task)}>
            {t('actions.claim')}
          </Button>
        )}
      />
      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
