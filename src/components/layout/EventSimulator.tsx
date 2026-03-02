import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClientStore } from '@/store/client-store'
import { eventBus } from '@/lib/event-bus'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Zap } from 'lucide-react'

const CRM_EVENTS = [
  { value: 'crm.clientRegistered', labelEn: 'Client Registered', labelZh: '客户注册' },
  { value: 'crm.kycApproved', labelEn: 'KYC Approved', labelZh: 'KYC通过' },
  { value: 'crm.kycRejected', labelEn: 'KYC Rejected', labelZh: 'KYC拒绝' },
  { value: 'crm.clientFunded', labelEn: 'Client Funded', labelZh: '客户入金' },
  { value: 'crm.clientTraded', labelEn: 'Client Traded', labelZh: '客户交易' },
] as const

export function EventSimulator() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const clients = useClientStore((s) => s.clients)
  const [clientId, setClientId] = useState('')
  const [eventType, setEventType] = useState('')
  const [fired, setFired] = useState(false)
  const [open, setOpen] = useState(false)

  const handleFire = () => {
    if (!clientId || !eventType) return
    // Use type assertion since we know these are valid EventMap keys
    ;(eventBus as any).emit(eventType, { clientId })
    setFired(true)
    setTimeout(() => setFired(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title={isZh ? '事件模拟器' : 'Event Simulator'}>
          <Zap className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isZh ? 'CRM 事件模拟器' : 'CRM Event Simulator'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{isZh ? '选择客户' : 'Select Client'}</label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder={isZh ? '选择客户...' : 'Choose a client...'} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({t(`clientStatus.${c.status}`)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{isZh ? '事件类型' : 'Event Type'}</label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder={isZh ? '选择事件...' : 'Choose an event...'} />
              </SelectTrigger>
              <SelectContent>
                {CRM_EVENTS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {isZh ? e.labelZh : e.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleFire}
            disabled={!clientId || !eventType}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            {fired
              ? (isZh ? '✓ 事件已触发!' : '✓ Event Fired!')
              : (isZh ? '触发事件' : 'Fire Event')}
          </Button>

          {fired && (
            <p className="text-xs text-green-600 text-center">
              {isZh ? '工作流已触发，请检查通知和任务列表。' : 'Workflow triggered. Check notifications and task list.'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
