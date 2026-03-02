import { create } from 'zustand'
import type { IBDeal, IBDealStatus, ApprovalHistoryEntry } from '@/types/ib-deal'
import { mockIBDeals } from '@/data/ib-deals'
import { eventBus } from '@/lib/event-bus'

interface IBState {
  ibDeals: IBDeal[]
  createIBDeal: (deal: IBDeal) => void
  approveIBDeal: (dealId: string, actor: string) => void
  rejectIBDeal: (dealId: string, actor: string, reason: string) => void
  resubmitIBDeal: (dealId: string, updates: Partial<IBDeal>) => void
  expireIBDeal: (dealId: string) => void
}

export const useIBStore = create<IBState>((set, _get) => ({
  ibDeals: [...mockIBDeals],

  createIBDeal: (deal) => {
    set((state) => ({ ibDeals: [deal, ...state.ibDeals] }))
    eventBus.emit('ib.created', { deal })
  },

  approveIBDeal: (dealId, actor) => {
    set((state) => ({
      ibDeals: state.ibDeals.map((d) => {
        if (d.id !== dealId) return d
        const entry: ApprovalHistoryEntry = {
          id: `ah-${Date.now()}`,
          action: 'approved',
          actor,
          timestamp: new Date().toISOString(),
          statusChange: { from: d.status, to: 'approved' },
        }
        return {
          ...d,
          status: 'approved' as IBDealStatus,
          approvalHistory: [...d.approvalHistory, entry],
        }
      }),
    }))
    eventBus.emit('ib.approved', { dealId, actor })
  },

  rejectIBDeal: (dealId, actor, reason) => {
    set((state) => ({
      ibDeals: state.ibDeals.map((d) => {
        if (d.id !== dealId) return d
        const entry: ApprovalHistoryEntry = {
          id: `ah-${Date.now()}`,
          action: 'rejected',
          actor,
          timestamp: new Date().toISOString(),
          reason,
          statusChange: { from: d.status, to: 'rejected' },
        }
        return {
          ...d,
          status: 'rejected' as IBDealStatus,
          approvalHistory: [...d.approvalHistory, entry],
        }
      }),
    }))
    eventBus.emit('ib.rejected', { dealId, actor, reason })
  },

  resubmitIBDeal: (dealId, updates) => {
    set((state) => ({
      ibDeals: state.ibDeals.map((d) => {
        if (d.id !== dealId) return d
        const entry: ApprovalHistoryEntry = {
          id: `ah-${Date.now()}`,
          action: 'submitted',
          actor: d.createdBy,
          timestamp: new Date().toISOString(),
          statusChange: { from: 'rejected', to: 'pending_approval' },
        }
        return {
          ...d,
          ...updates,
          status: 'pending_approval' as IBDealStatus,
          approvalHistory: [...d.approvalHistory, entry],
        }
      }),
    }))
    eventBus.emit('ib.resubmitted', { dealId })
  },

  expireIBDeal: (dealId) => {
    set((state) => ({
      ibDeals: state.ibDeals.map((d) =>
        d.id === dealId ? { ...d, status: 'expired' as IBDealStatus } : d
      ),
    }))
    eventBus.emit('ib.expired', { dealId })
  },
}))
