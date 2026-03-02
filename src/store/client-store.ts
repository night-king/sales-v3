import { create } from 'zustand'
import type { Client, ClientStatus } from '@/types/client'
import { mockClients } from '@/data/clients'
import { eventBus } from '@/lib/event-bus'

interface ClientState {
  clients: Client[]
  claimClient: (clientId: string, userId: string) => void
  releaseClient: (clientId: string) => void
  updateClient: (clientId: string, updates: Partial<Client>) => void
  updateClientStatus: (clientId: string, status: ClientStatus) => void
  addClient: (client: Client) => void
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [...mockClients],

  claimClient: (clientId, userId) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, assignedTo: userId, status: 'registered' as ClientStatus } : c
      ),
    }))
    eventBus.emit('client.claimed', { clientId, userId })
  },

  releaseClient: (clientId) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, assignedTo: undefined, status: 'lead' } : c
      ),
    }))
    eventBus.emit('client.released', { clientId })
  },

  updateClient: (clientId, updates) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, ...updates } : c
      ),
    })),

  updateClientStatus: (clientId, status) => {
    const client = get().clients.find((c) => c.id === clientId)
    const from = client?.status ?? 'lead'
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, status } : c
      ),
    }))
    if (from !== status) {
      eventBus.emit('client.statusChanged', { clientId, from, to: status })
    }
  },

  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),
}))
