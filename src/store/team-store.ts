import { create } from 'zustand'
import { mockGroups } from '@/data/teams'
import type { Group } from '@/data/teams'

interface TeamState {
  groups: Group[]
  createGroup: (group: Group) => void
  updateGroup: (groupId: string, updates: Partial<Group>) => void
  deleteGroup: (groupId: string) => void
}

export const useTeamStore = create<TeamState>((set) => ({
  groups: [...mockGroups],

  createGroup: (group) =>
    set((state) => ({ groups: [group, ...state.groups] })),

  updateGroup: (groupId, updates) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, ...updates } : g
      ),
    })),

  deleteGroup: (groupId) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
    })),
}))
