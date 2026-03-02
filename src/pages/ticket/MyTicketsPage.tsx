import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTicketStore } from '@/store/ticket-store'
import { PageHeader } from '@/components/common/PageHeader'
import { TicketTable } from './components/TicketTable'
import { TicketDetailDrawer } from './components/TicketDetailDrawer'
import type { Ticket } from '@/types/ticket'

export default function MyTicketsPage() {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const tickets = useTicketStore((s) => s.tickets)

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const myTickets = tickets.filter((ticket) => ticket.assignedTo === currentUser?.id)

  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setDrawerOpen(true)
  }

  return (
    <div>
      <PageHeader title={t('menu:myTickets')} />
      <TicketTable data={myTickets} onRowClick={handleRowClick} />
      <TicketDetailDrawer
        ticket={selectedTicket}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
