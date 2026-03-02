import { create } from 'zustand'
import type { Ticket, TicketStatus, EscalationRecord } from '@/types/ticket'
import { mockTickets } from '@/data/tickets'
import { eventBus } from '@/lib/event-bus'

interface TicketState {
  tickets: Ticket[]
  createTicket: (ticket: Ticket) => void
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void
  escalateTicket: (ticketId: string, escalation: EscalationRecord) => void
  assignTicket: (ticketId: string, userId: string) => void
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [...mockTickets],

  createTicket: (ticket) => {
    set((state) => ({ tickets: [ticket, ...state.tickets] }))
    eventBus.emit('ticket.created', { ticket })
  },

  updateTicketStatus: (ticketId, status) => {
    const ticket = get().tickets.find((t) => t.id === ticketId)
    const from = ticket?.status ?? 'open'
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status } : t
      ),
    }))
    if (from !== status) {
      eventBus.emit('ticket.statusChanged', { ticketId, from, to: status })
    }
  },

  escalateTicket: (ticketId, escalation) => {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'on_hold' as TicketStatus,
              escalationHistory: [...t.escalationHistory, escalation],
            }
          : t
      ),
    }))
    eventBus.emit('ticket.escalated', { ticketId, escalation })
  },

  assignTicket: (ticketId, userId) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: userId } : t
      ),
    })),
}))
