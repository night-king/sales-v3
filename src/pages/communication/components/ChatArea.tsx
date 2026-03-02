import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CHANNELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, TicketPlus, Check } from 'lucide-react'
import { useTicketStore } from '@/store/ticket-store'
import { useAuthStore } from '@/store/auth-store'
import type { Conversation, Message } from '@/data/communications'
import type { Ticket } from '@/types/ticket'

interface ChatAreaProps {
  conversation: Conversation | null
  onSendMessage: (conversationId: string, content: string) => void
}

export function ChatArea({ conversation, onSendMessage }: ChatAreaProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [inputValue, setInputValue] = useState('')
  const [ticketCreated, setTicketCreated] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const createTicket = useTicketStore((s) => s.createTicket)
  const currentUser = useAuthStore((s) => s.currentUser)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages.length])

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">{isZh ? '选择一个会话开始聊天' : 'Select a conversation to start chatting'}</p>
      </div>
    )
  }

  const channelConfig = CHANNELS.find((c) => c.value === conversation.channel)
  const channelLabel = channelConfig
    ? (isZh ? channelConfig.labelZh : channelConfig.labelEn)
    : conversation.channel

  const channelColors: Record<string, string> = {
    livechat: 'bg-green-100 text-green-800',
    whatsapp: 'bg-emerald-100 text-emerald-800',
    email: 'bg-blue-100 text-blue-800',
    phone: 'bg-purple-100 text-purple-800',
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    onSendMessage(conversation.id, inputValue.trim())
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCreateTicket = () => {
    if (!currentUser) return

    const ticket: Ticket = {
      id: `ticket-chat-${Date.now()}`,
      source: 'internal_created',
      channel: 'livechat',
      category: 'general',
      priority: 'medium',
      status: 'open',
      content: `Ticket created from conversation`,
      clientId: conversation.clientId,
      createdBy: currentUser.id,
      assignedTo: currentUser.id,
      createdAt: new Date().toISOString(),
      escalationHistory: [],
      history: [],
    }

    createTicket(ticket)
    setTicketCreated(true)
    setTimeout(() => setTicketCreated(false), 2000)
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold">{conversation.clientName}</h3>
        <Badge variant="outline" className={cn('border-0 text-xs', channelColors[conversation.channel] ?? '')}>
          {channelLabel}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {conversation.messages.map((msg: Message) => {
            const isSent = msg.sender === 'agent'
            return (
              <div
                key={msg.id}
                className={cn('flex flex-col max-w-[75%]', isSent ? 'ml-auto items-end' : 'items-start')}
              >
                <span className="text-[11px] text-muted-foreground mb-1 px-1">
                  {msg.senderName}
                </span>
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm',
                    isSent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-3 border-t shrink-0">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isZh ? '输入消息...' : 'Type a message...'}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateTicket}
          disabled={ticketCreated}
          className="shrink-0 gap-1.5"
        >
          {ticketCreated ? (
            <>
              <Check className="h-4 w-4" />
              {isZh ? '已创建' : 'Created!'}
            </>
          ) : (
            <>
              <TicketPlus className="h-4 w-4" />
              {t('actions.createTicket')}
            </>
          )}
        </Button>
        <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
