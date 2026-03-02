import { create } from 'zustand'
import { mockAutomationRules } from '@/data/automation-rules'
import type { AutomationRule } from '@/data/automation-rules'

interface AutomationState {
  rules: AutomationRule[]
  toggleRule: (ruleId: string) => void
  createRule: (rule: AutomationRule) => void
  updateRule: (ruleId: string, updates: Partial<AutomationRule>) => void
  deleteRule: (ruleId: string) => void
}

export const useAutomationStore = create<AutomationState>((set) => ({
  rules: [...mockAutomationRules],

  toggleRule: (ruleId) =>
    set((state) => ({
      rules: state.rules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      ),
    })),

  createRule: (rule) =>
    set((state) => ({ rules: [rule, ...state.rules] })),

  updateRule: (ruleId, updates) =>
    set((state) => ({
      rules: state.rules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    })),

  deleteRule: (ruleId) =>
    set((state) => ({
      rules: state.rules.filter((r) => r.id !== ruleId),
    })),
}))
