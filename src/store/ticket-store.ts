import { create } from 'zustand'
import type { Ticket, TicketStatus, EscalationRecord } from '@/types/ticket'
import { mockTickets } from '@/data/tickets'

interface TicketState {
  tickets: Ticket[]
  createTicket: (ticket: Ticket) => void
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void
  escalateTicket: (ticketId: string, escalation: EscalationRecord) => void
  assignTicket: (ticketId: string, userId: string) => void
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [...mockTickets],

  createTicket: (ticket) =>
    set((state) => ({ tickets: [ticket, ...state.tickets] })),

  updateTicketStatus: (ticketId, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status } : t
      ),
    })),

  escalateTicket: (ticketId, escalation) =>
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
    })),

  assignTicket: (ticketId, userId) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: userId } : t
      ),
    })),
}))
