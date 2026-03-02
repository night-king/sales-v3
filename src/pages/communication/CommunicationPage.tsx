import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useClientStore } from '@/store/client-store'
import { mockConversations, type Conversation, type Message } from '@/data/communications'
import { useAuthStore } from '@/store/auth-store'
import { PageHeader } from '@/components/common/PageHeader'
import { ConversationList } from './components/ConversationList'
import { ChatArea } from './components/ChatArea'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function CommunicationPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.currentUser)
  const clients = useClientStore((s) => s.clients)

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null
  const selectedClient = selectedConversation
    ? clients.find((c) => c.id === selectedConversation.clientId)
    : null

  const handleSelect = useCallback((conv: Conversation) => {
    setSelectedId(conv.id)
  }, [])

  const handleSendMessage = useCallback(
    (conversationId: string, content: string) => {
      if (!currentUser) return

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        senderName: currentUser.name,
        content,
        timestamp: new Date().toISOString(),
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: content,
            lastMessageTime: newMessage.timestamp,
          }
        })
      )
    },
    [currentUser]
  )

  return (
    <div>
      <PageHeader title={t('menu:communication')} />
      <div className="flex h-[calc(100vh-180px)] rounded-lg border bg-background overflow-hidden">
        {/* Left: Conversation List */}
        <div className="w-[280px] shrink-0">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        {/* Center: Chat Area */}
        <div className="flex-1 border-l">
          <ChatArea
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Right: Client Context Panel */}
        <div className="w-[300px] shrink-0 border-l">
          {selectedClient ? (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-semibold">
                {isZh ? '客户信息' : 'Client Info'}
              </h3>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('table.name')}</span>
                  <span className="text-sm font-medium">{selectedClient.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('table.status')}</span>
                  <StatusBadge status={selectedClient.status} type="client" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('table.country')}</span>
                  <span className="text-sm">{selectedClient.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('table.balance')}</span>
                  <span className="text-sm font-medium">
                    ${(selectedClient.walletBalance + selectedClient.mt5Balance).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('table.email')}</span>
                  <span className="text-sm truncate max-w-[150px]" title={selectedClient.email}>
                    {selectedClient.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('table.phone')}</span>
                  <span className="text-sm">{selectedClient.phone}</span>
                </div>
              </div>
              <Separator />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/client/${selectedClient.id}`)}
              >
                {t('actions.viewDetail')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">
                {isZh ? '选择会话查看客户信息' : 'Select a conversation to view client info'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
