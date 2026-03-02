import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTaskStore } from '@/store/task-store'
import { PageHeader } from '@/components/common/PageHeader'
import { TaskTable } from './components/TaskTable'
import { TaskDetailDrawer } from './components/TaskDetailDrawer'
import type { Task } from '@/types/task'

export default function MyTasksPage() {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const tasks = useTaskStore((s) => s.tasks)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const myTasks = tasks.filter((task) => task.assignedTo === currentUser?.id)

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  return (
    <div>
      <PageHeader title={t('menu:myTasks')} />
      <TaskTable data={myTasks} onRowClick={handleRowClick} />
      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
