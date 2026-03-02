import { create } from 'zustand'
import type { Task, TaskStatus } from '@/types/task'
import { mockTasks } from '@/data/tasks'
import { eventBus } from '@/lib/event-bus'

interface TaskState {
  tasks: Task[]
  claimTask: (taskId: string, userId: string) => void
  returnTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  assignTask: (taskId: string, userId: string) => void
  createTask: (task: Task) => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [...mockTasks],

  claimTask: (taskId, userId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: userId, status: 'in_progress' as TaskStatus } : t
      ),
    }))
    eventBus.emit('task.claimed', { taskId, userId })
  },

  returnTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: undefined, status: 'pending' as TaskStatus } : t
      ),
    }))
    eventBus.emit('task.returned', { taskId })
  },

  updateTaskStatus: (taskId, status) => {
    const task = get().tasks.find((t) => t.id === taskId)
    const from = task?.status ?? 'pending'
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    }))
    if (task && from !== status) {
      const updated = get().tasks.find((t) => t.id === taskId)!
      eventBus.emit('task.statusChanged', { taskId, from, to: status, task: updated })
    }
  },

  assignTask: (taskId, userId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: userId } : t
      ),
    })),

  createTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }))
    eventBus.emit('task.created', { task })
  },
}))
