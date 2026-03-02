import { create } from 'zustand'
import type { Notification } from '@/types/common'
import { mockNotifications } from '@/data/notifications'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (params: { type: Notification['type']; title: string; description: string; link?: string }) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [...mockNotifications],
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  addNotification: (params) =>
    set((state) => {
      const notification: Notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...params,
        timestamp: new Date().toISOString(),
        read: false,
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }
    }),

  markAsRead: (notificationId) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}))
