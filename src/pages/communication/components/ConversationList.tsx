import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CHANNELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import type { Conversation } from '@/data/communications'

type ChannelFilter = 'all' | Conversation['channel']

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (conversation: Conversation) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all')

  const filteredConversations = channelFilter === 'all'
    ? conversations
    : conversations.filter((c) => c.channel === channelFilter)

  const channelTabs: { value: ChannelFilter; label: string }[] = [
    { value: 'all', label: isZh ? '全部' : 'All' },
    ...CHANNELS.map((ch) => ({
      value: ch.value as ChannelFilter,
      label: isZh ? ch.labelZh : ch.labelEn,
    })),
  ]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString()
  }

  const channelIcons: Record<string, string> = {
    livechat: '💬',
    whatsapp: '📱',
    email: '📧',
    phone: '📞',
  }

  return (
    <div className="flex flex-col h-full border-r">
      {/* Channel tabs */}
      <div className="flex flex-wrap gap-1 p-3 border-b">
        {channelTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setChannelFilter(tab.value)}
            className={cn(
              'px-2.5 py-1 text-xs rounded-md font-medium transition-colors',
              channelFilter === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={cn(
                'w-full px-3 py-3 text-left transition-colors hover:bg-muted/50',
                selectedId === conv.id && 'bg-muted'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm" title={isZh ? (CHANNELS.find(c => c.value === conv.channel)?.labelZh ?? conv.channel) : (CHANNELS.find(c => c.value === conv.channel)?.labelEn ?? conv.channel)}>
                    {channelIcons[conv.channel] ?? ''}
                  </span>
                  <span className="text-sm font-medium truncate">{conv.clientName}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {conv.unreadCount > 0 && (
                    <Badge className="h-5 min-w-[20px] px-1.5 text-[10px]">
                      {conv.unreadCount}
                    </Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate pl-6">
                {conv.lastMessage}
              </p>
            </button>
          ))}
          {filteredConversations.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {t('table.noData')}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
