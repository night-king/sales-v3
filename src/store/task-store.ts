import { create } from 'zustand'
import type { Task } from '@/types/task'
import type { TaskStatus } from '@/types/task'
import { mockTasks } from '@/data/tasks'

interface TaskState {
  tasks: Task[]
  claimTask: (taskId: string, userId: string) => void
  returnTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  assignTask: (taskId: string, userId: string) => void
  createTask: (task: Task) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [...mockTasks],

  claimTask: (taskId, userId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: userId, status: 'in_progress' as TaskStatus } : t
      ),
    })),

  returnTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: undefined, status: 'pending' as TaskStatus } : t
      ),
    })),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),

  assignTask: (taskId, userId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignedTo: userId } : t
      ),
    })),

  createTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),
}))
