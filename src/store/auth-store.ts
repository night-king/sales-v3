import { create } from 'zustand'
import type { Role } from '@/types/common'
import type { User } from '@/types/user'
import { mockUsers, CURRENT_USER_IDS } from '@/data/users'
import i18n from '@/i18n'

interface AuthState {
  currentUser: User | null
  currentRole: Role
  language: 'en' | 'zh'
  isLoggedIn: boolean
  login: (role: Role) => void
  switchRole: (role: Role) => void
  switchLanguage: (lang: 'en' | 'zh') => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  currentRole: 'sales',
  language: 'en',
  isLoggedIn: false,

  login: (role) => {
    const userId = CURRENT_USER_IDS[role]
    const user = mockUsers.find((u) => u.id === userId) ?? null
    set({ currentUser: user, currentRole: role, isLoggedIn: true })
  },

  switchRole: (role) => {
    const userId = CURRENT_USER_IDS[role]
    const user = mockUsers.find((u) => u.id === userId) ?? null
    set({ currentUser: user, currentRole: role })
  },

  switchLanguage: (lang) => {
    i18n.changeLanguage(lang)
    set({ language: lang })
  },

  logout: () => {
    set({ currentUser: null, isLoggedIn: false })
  },
}))
