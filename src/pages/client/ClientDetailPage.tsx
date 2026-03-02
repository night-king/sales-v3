import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClientStore } from '@/store/client-store'
import { useTaskStore } from '@/store/task-store'
import { useTicketStore } from '@/store/ticket-store'
import { mockUsers } from '@/data/users'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'

export default function ClientDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const clients = useClientStore((s) => s.clients)
  const tasks = useTaskStore((s) => s.tasks)
  const tickets = useTicketStore((s) => s.tickets)

  const client = clients.find((c) => c.id === id)

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">{t('table.noData')}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('actions.back')}
        </Button>
      </div>
    )
  }

  const assignedUser = mockUsers.find((u) => u.id === client.assignedTo)
  const relatedTasks = tasks.filter((task) => task.clientId === client.id)
  const relatedTickets = tickets.filter((ticket) => ticket.clientId === client.id)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('actions.back')}
      </Button>

      {/* Client info card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{client.name}</CardTitle>
            <StatusBadge status={client.status} type="client" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label={t('table.country')} value={client.country} />
            <InfoItem label={t('table.language')} value={client.language} />
            <InfoItem label={t('table.phone')} value={client.phone} />
            <InfoItem label={t('table.email')} value={client.email} />
            <InfoItem label={t('table.balance')} value={`$${client.walletBalance.toLocaleString()}`} />
            <InfoItem label={t('table.assignedTo')} value={assignedUser?.name ?? '-'} />
            <InfoItem label={t('table.createdAt')} value={new Date(client.createdAt).toLocaleDateString()} />
            {client.cid && <InfoItem label="CID" value={client.cid} />}
            {client.registeredAt && (
              <InfoItem
                label={t('clientStatus.registered')}
                value={new Date(client.registeredAt).toLocaleDateString()}
              />
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('table.tags')}</p>
              <div className="flex flex-wrap gap-1">
                {client.tags.length > 0 ? (
                  client.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for related data */}
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">
            {t('menu:task')} ({relatedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="tickets">
            {t('menu:ticket')} ({relatedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="communications">
            {t('menu:communication')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          {relatedTasks.length > 0 ? (
            <div className="space-y-3">
              {relatedTasks.map((task) => {
                const taskAssignee = mockUsers.find((u) => u.id === task.assignedTo)
                return (
                  <Card key={task.id}>
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {t(`taskType.${task.type}`)}
                            </span>
                            <StatusBadge status={task.status} type="task" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t('table.assignedTo')}: {taskAssignee?.name ?? '-'}
                            {' | '}
                            {t('table.createdAt')}: {new Date(task.createdAt).toLocaleDateString()}
                            {task.dueDate && (
                              <>
                                {' | '}
                                {t('table.dueDate')}: {new Date(task.dueDate).toLocaleDateString()}
                              </>
                            )}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {t(`priority.${task.priority}`)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('table.noData')}
            </p>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="mt-4">
          {relatedTickets.length > 0 ? (
            <div className="space-y-3">
              {relatedTickets.map((ticket) => {
                const ticketAssignee = mockUsers.find((u) => u.id === ticket.assignedTo)
                return (
                  <Card key={ticket.id}>
                    <CardContent className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {t(`ticketCategory.${ticket.category}`)}
                            </span>
                            <StatusBadge status={ticket.status} type="ticket" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {ticket.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('table.assignedTo')}: {ticketAssignee?.name ?? '-'}
                            {' | '}
                            {t('table.createdAt')}: {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {t(`priority.${ticket.priority}`)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('table.noData')}
            </p>
          )}
        </TabsContent>

        <TabsContent value="communications" className="mt-4">
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">
              {t('menu:communication')} - Coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}
