import { create } from 'zustand'
import type { Client } from '@/types/client'
import { mockClients } from '@/data/clients'

interface ClientState {
  clients: Client[]
  claimClient: (clientId: string, userId: string) => void
  releaseClient: (clientId: string) => void
  updateClient: (clientId: string, updates: Partial<Client>) => void
  addClient: (client: Client) => void
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [...mockClients],

  claimClient: (clientId, userId) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, assignedTo: userId } : c
      ),
    })),

  releaseClient: (clientId) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, assignedTo: undefined, status: 'lead' } : c
      ),
    })),

  updateClient: (clientId, updates) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, ...updates } : c
      ),
    })),

  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),
}))
