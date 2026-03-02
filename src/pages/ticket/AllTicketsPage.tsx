import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTicketStore } from '@/store/ticket-store'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { TicketTable } from './components/TicketTable'
import { TicketDetailDrawer } from './components/TicketDetailDrawer'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TICKET_CATEGORIES, PRIORITIES } from '@/lib/constants'
import type { Ticket, TicketCategory } from '@/types/ticket'
import type { Priority } from '@/types/common'

export default function AllTicketsPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const currentUser = useAuthStore((s) => s.currentUser)
  const tickets = useTicketStore((s) => s.tickets)
  const createTicket = useTicketStore((s) => s.createTicket)
  const clients = useClientStore((s) => s.clients)

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Create ticket form state
  const [newCategory, setNewCategory] = useState<TicketCategory | ''>('')
  const [newPriority, setNewPriority] = useState<Priority | ''>('')
  const [newClientId, setNewClientId] = useState('')
  const [newContent, setNewContent] = useState('')

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setDrawerOpen(true)
  }

  const resetForm = () => {
    setNewCategory('')
    setNewPriority('')
    setNewClientId('')
    setNewContent('')
  }

  const handleCreateTicket = () => {
    if (!newCategory || !newPriority || !newClientId || !newContent.trim() || !currentUser) return

    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      source: 'internal_created',
      channel: 'email',
      category: newCategory,
      priority: newPriority,
      status: 'open',
      content: newContent.trim(),
      clientId: newClientId,
      createdBy: currentUser.id,
      assignedTo: undefined,
      createdAt: new Date().toISOString(),
      escalationHistory: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          action: 'created',
          actor: currentUser.id,
          timestamp: new Date().toISOString(),
          details: 'Ticket created internally.',
        },
      ],
    }

    createTicket(ticket)
    resetForm()
    setDialogOpen(false)
  }

  const isFormValid = newCategory && newPriority && newClientId && newContent.trim()

  return (
    <div>
      <PageHeader
        title={t('menu:allTickets')}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('actions.createTicket')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('actions.createTicket')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label>{t('table.category')}</Label>
                  <Select
                    value={newCategory}
                    onValueChange={(val) => setNewCategory(val as TicketCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {isZh ? c.labelZh : c.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>{t('table.priority')}</Label>
                  <Select
                    value={newPriority}
                    onValueChange={(val) => setNewPriority(val as Priority)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {isZh ? p.labelZh : p.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label>{t('table.client')}</Label>
                  <Select
                    value={newClientId}
                    onValueChange={setNewClientId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>{isZh ? '工单内容' : 'Content'}</Label>
                  <Textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={t('form.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false) }}>
                    {t('actions.cancel')}
                  </Button>
                  <Button onClick={handleCreateTicket} disabled={!isFormValid}>
                    {t('actions.create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <TicketTable data={tickets} onRowClick={handleRowClick} />
      <TicketDetailDrawer
        ticket={selectedTicket}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
