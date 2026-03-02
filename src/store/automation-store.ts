import { create } from 'zustand'
import { mockAutomationRules } from '@/data/automation-rules'
import type { AutomationRule } from '@/data/automation-rules'
import { eventBus } from '@/lib/event-bus'

interface AutomationState {
  rules: AutomationRule[]
  executionLog: { id: string; ruleId: string; ruleName: string; event: string; result: 'success' | 'skipped'; timestamp: string }[]
  toggleRule: (ruleId: string) => void
  createRule: (rule: AutomationRule) => void
  updateRule: (ruleId: string, updates: Partial<AutomationRule>) => void
  deleteRule: (ruleId: string) => void
  addLogEntry: (entry: { id: string; ruleId: string; ruleName: string; event: string; result: 'success' | 'skipped'; timestamp: string }) => void
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
  rules: [...mockAutomationRules],
  executionLog: [],

  toggleRule: (ruleId) => {
    const rule = get().rules.find((r) => r.id === ruleId)
    const newEnabled = rule ? !rule.enabled : true
    set((state) => ({
      rules: state.rules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      ),
    }))
    eventBus.emit('automation.ruleToggled', { ruleId, enabled: newEnabled })
  },

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

  addLogEntry: (entry) =>
    set((state) => ({
      executionLog: [entry, ...state.executionLog],
    })),
}))
