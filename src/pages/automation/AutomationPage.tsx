import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { useAutomationStore } from '@/store/automation-store'
import { DataTable } from '@/components/data-table/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import type { AutomationRule } from '@/data/automation-rules'

const TRIGGER_COLORS: Record<string, string> = {
  event: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  both: 'bg-teal-100 text-teal-700',
}

export default function AutomationPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { rules, toggleRule, createRule, executionLog } = useAutomationStore()
  const currentRole = useAuthStore((s) => s.currentRole)
  const isManager = currentRole === 'manager' || currentRole === 'admin'

  const [dialogOpen, setDialogOpen] = useState(false)
  const [ruleName, setRuleName] = useState('')
  const [ruleDescription, setRuleDescription] = useState('')
  const [triggerType, setTriggerType] = useState<'event' | 'scheduled' | 'both'>('event')

  const handleCreate = () => {
    if (!ruleName.trim()) return
    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: ruleName.trim(),
      nameZh: ruleName.trim(),
      enabled: true,
      triggerType,
      conditions: [
        {
          logic: 'AND',
          conditions: [
            {
              field: 'custom',
              fieldLabel: 'Custom',
              operator: 'equals',
              value: 'value',
              valueLabel: ruleDescription || 'Custom condition',
            },
          ],
        },
      ],
      actions: [
        {
          type: 'notify_manager',
          typeLabel: 'Notify Manager',
          config: { message: ruleDescription || 'Custom action' },
        },
      ],
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
    createRule(newRule)
    setRuleName('')
    setRuleDescription('')
    setTriggerType('event')
    setDialogOpen(false)
  }

  const columns: ColumnDef<AutomationRule, unknown>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
      cell: ({ row }) => (
        <span className="font-medium">
          {isZh ? row.original.nameZh : row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'enabled',
      header: 'Enabled',
      cell: ({ row }) => (
        <Switch
          checked={row.original.enabled}
          onCheckedChange={() => toggleRule(row.original.id)}
        />
      ),
    },
    {
      accessorKey: 'triggerType',
      header: 'Trigger',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`border-0 ${TRIGGER_COLORS[row.original.triggerType] ?? ''}`}
        >
          {row.original.triggerType}
        </Badge>
      ),
    },
    {
      id: 'conditions',
      header: 'Conditions',
      cell: ({ row }) => {
        const allConditions = row.original.conditions.flatMap((g) => g.conditions)
        return (
          <span className="text-sm text-muted-foreground">
            {allConditions.map((c) => `${c.fieldLabel} ${c.operator} ${c.valueLabel}`).join(', ')}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.actions.map((a, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {a.typeLabel}
            </Badge>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('menu:automation')}
        actions={
          isManager ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('actions.create')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Automation Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t('table.name')}</Label>
                    <Input
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      placeholder="Rule name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select
                      value={triggerType}
                      onValueChange={(v) => setTriggerType(v as 'event' | 'scheduled' | 'both')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('table.description')}</Label>
                    <Textarea
                      value={ruleDescription}
                      onChange={(e) => setRuleDescription(e.target.value)}
                      placeholder={t('form.descriptionPlaceholder')}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t('actions.cancel')}</Button>
                  </DialogClose>
                  <Button onClick={handleCreate}>{t('actions.create')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <Tabs defaultValue="rules" className="mt-4">
        <TabsList>
          <TabsTrigger value="rules">
            {isZh ? '规则' : 'Rules'}
          </TabsTrigger>
          <TabsTrigger value="log">
            {isZh ? '执行日志' : 'Execution Log'}
            {executionLog.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {executionLog.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <DataTable
            columns={columns}
            data={rules}
            searchColumn="name"
            searchPlaceholder={t('actions.search')}
          />
        </TabsContent>

        <TabsContent value="log">
          {executionLog.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              {isZh
                ? '暂无执行记录。触发CRM事件以执行自动化规则。'
                : 'No executions yet. Fire a CRM event to trigger automation rules.'}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                      {isZh ? '时间' : 'Timestamp'}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      {isZh ? '规则名称' : 'Rule Name'}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      {isZh ? '事件' : 'Event'}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      {isZh ? '结果' : 'Result'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {executionLog.map((entry) => (
                    <tr key={entry.id} className="border-b last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium">{entry.ruleName}</td>
                      <td className="px-4 py-3">{entry.event}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={entry.result === 'success' ? 'default' : 'secondary'}
                          className={
                            entry.result === 'success'
                              ? 'bg-green-100 text-green-700 border-0'
                              : 'bg-gray-100 text-gray-600 border-0'
                          }
                        >
                          {entry.result === 'success'
                            ? (isZh ? '成功' : 'Success')
                            : (isZh ? '跳过' : 'Skipped')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
