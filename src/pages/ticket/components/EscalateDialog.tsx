import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTicketStore } from '@/store/ticket-store'
import { useAuthStore } from '@/store/auth-store'
import { PRIORITIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Priority } from '@/types/common'
import type { EscalationType } from '@/types/ticket'

interface EscalateDialogProps {
  ticketId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EscalateDialog({ ticketId, open, onOpenChange }: EscalateDialogProps) {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const currentUser = useAuthStore((s) => s.currentUser)
  const escalateTicket = useTicketStore((s) => s.escalateTicket)

  const [type, setType] = useState<EscalationType>('submit_to_manager')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setType('submit_to_manager')
    setPriority('')
    setReason('')
    setNotes('')
  }

  const handleSubmit = () => {
    if (!priority || !reason.trim() || !currentUser) return

    escalateTicket(ticketId, {
      id: `esc-${Date.now()}`,
      type,
      priority,
      reason: reason.trim(),
      notes: notes.trim() || undefined,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    })

    resetForm()
    onOpenChange(false)
  }

  const isFormValid = priority && reason.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('actions.escalate')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Escalation Type */}
          <div className="space-y-2">
            <Label>{isZh ? '升级类型' : 'Escalation Type'}</Label>
            <Select
              value={type}
              onValueChange={(val) => setType(val as EscalationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submit_to_manager">
                  {t('escalation.submitToManager')}
                </SelectItem>
                <SelectItem value="forward_to_sales">
                  {t('escalation.forwardToSales')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>{t('table.priority')}</Label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val as Priority)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('form.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {isZh ? p.labelZh : p.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>
              {t('escalation.reason')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('form.reasonPlaceholder')}
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>
              {t('escalation.notes')}{' '}
              <span className="text-muted-foreground text-xs">({t('form.optional')})</span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('form.notesPlaceholder')}
              rows={2}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              {t('actions.submit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
