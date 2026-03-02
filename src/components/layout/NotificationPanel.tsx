import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Bell } from 'lucide-react'

const typeColors: Record<string, string> = {
  task: 'border-l-blue-500',
  ticket: 'border-l-yellow-500',
  ib: 'border-l-green-500',
  client: 'border-l-purple-500',
  system: 'border-l-gray-500',
}

export function NotificationPanel() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()

  const handleClick = (id: string, link?: string) => {
    markAsRead(id)
    if (link) navigate(link)
  }

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return t('time.justNow')
    if (mins < 60) return t('time.minutesAgo', { count: mins })
    const hours = Math.floor(mins / 60)
    if (hours < 24) return t('time.hoursAgo', { count: hours })
    const days = Math.floor(hours / 24)
    return t('time.daysAgo', { count: days })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">{t('notification.title')}</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
              {t('notification.markAllRead')}
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t('notification.noNotifications')}
            </p>
          ) : (
            notifications.slice(0, 30).map((n) => (
              <div
                key={n.id}
                className={`flex flex-col gap-1 p-3 border-b border-l-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                  typeColors[n.type] ?? 'border-l-gray-300'
                } ${n.read ? 'opacity-60' : 'bg-accent/20'}`}
                onClick={() => handleClick(n.id, n.link)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{formatTime(n.timestamp)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
