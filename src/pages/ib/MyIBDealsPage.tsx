import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useIBStore } from '@/store/ib-store'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { IBDealTable } from './components/IBDealTable'
import { IBDealDetailDrawer } from './components/IBDealDetailDrawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import type { IBDeal, CommissionType } from '@/types/ib-deal'

export default function MyIBDealsPage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const currentUser = useAuthStore((s) => s.currentUser)
  const ibDeals = useIBStore((s) => s.ibDeals)
  const createIBDeal = useIBStore((s) => s.createIBDeal)
  const resubmitIBDeal = useIBStore((s) => s.resubmitIBDeal)
  const clients = useClientStore((s) => s.clients)

  const [selectedDeal, setSelectedDeal] = useState<IBDeal | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Create form state
  const [newClientId, setNewClientId] = useState('')
  const [newCommissionRate, setNewCommissionRate] = useState('')
  const [newCommissionType, setNewCommissionType] = useState<CommissionType | ''>('')
  const [newMonthlyTarget, setNewMonthlyTarget] = useState('')
  const [newEffectiveDate, setNewEffectiveDate] = useState('')
  const [newNotes, setNewNotes] = useState('')

  const myDeals = ibDeals.filter((deal) => deal.createdBy === currentUser?.id)

  const handleRowClick = (deal: IBDeal) => {
    setSelectedDeal(deal)
    setDrawerOpen(true)
  }

  const resetForm = () => {
    setNewClientId('')
    setNewCommissionRate('')
    setNewCommissionType('')
    setNewMonthlyTarget('')
    setNewEffectiveDate('')
    setNewNotes('')
  }

  const handleCreate = () => {
    if (!newClientId || !newCommissionRate || !newCommissionType || !newMonthlyTarget || !newEffectiveDate || !currentUser) return

    const deal: IBDeal = {
      id: `ib-deal-${Date.now()}`,
      clientId: newClientId,
      createdBy: currentUser.id,
      commissionRate: parseFloat(newCommissionRate),
      commissionType: newCommissionType,
      monthlyTarget: newMonthlyTarget,
      effectiveDate: newEffectiveDate,
      notes: newNotes || undefined,
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
      approvalHistory: [
        {
          id: `ah-${Date.now()}`,
          action: 'created',
          actor: currentUser.id,
          timestamp: new Date().toISOString(),
          reason: 'New IB deal created.',
        },
        {
          id: `ah-${Date.now() + 1}`,
          action: 'submitted',
          actor: currentUser.id,
          timestamp: new Date().toISOString(),
          reason: 'Submitted for manager approval.',
          statusChange: { from: 'pending_approval', to: 'pending_approval' },
        },
      ],
    }

    createIBDeal(deal)
    resetForm()
    setDialogOpen(false)
  }

  const handleResubmit = (deal: IBDeal) => {
    resubmitIBDeal(deal.id, {})
  }

  const isFormValid = newClientId && newCommissionRate && newCommissionType && newMonthlyTarget && newEffectiveDate

  const commissionTypeOptions: { value: CommissionType; labelKey: string }[] = [
    { value: 'per_lot', labelKey: 'commission.perLot' },
    { value: 'percentage', labelKey: 'commission.percentage' },
    { value: 'fixed', labelKey: 'commission.fixed' },
  ]

  return (
    <div>
      <PageHeader
        title={t('menu:myIBDeals')}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('actions.createIBDeal')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('actions.createIBDeal')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Client */}
                <div className="space-y-2">
                  <Label>{t('table.client')}</Label>
                  <Select value={newClientId} onValueChange={setNewClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Commission Rate */}
                <div className="space-y-2">
                  <Label>{isZh ? '佣金费率' : 'Commission Rate'}</Label>
                  <Input
                    type="number"
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(e.target.value)}
                    placeholder={isZh ? '输入佣金费率' : 'Enter commission rate'}
                  />
                </div>

                {/* Commission Type */}
                <div className="space-y-2">
                  <Label>{isZh ? '佣金类型' : 'Commission Type'}</Label>
                  <Select
                    value={newCommissionType}
                    onValueChange={(val) => setNewCommissionType(val as CommissionType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {commissionTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monthly Target */}
                <div className="space-y-2">
                  <Label>{isZh ? '月度目标' : 'Monthly Target'}</Label>
                  <Input
                    value={newMonthlyTarget}
                    onChange={(e) => setNewMonthlyTarget(e.target.value)}
                    placeholder={isZh ? '输入月度目标' : 'Enter monthly target'}
                  />
                </div>

                {/* Effective Date */}
                <div className="space-y-2">
                  <Label>{isZh ? '生效日期' : 'Effective Date'}</Label>
                  <Input
                    type="date"
                    value={newEffectiveDate}
                    onChange={(e) => setNewEffectiveDate(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>{isZh ? '备注' : 'Notes'}</Label>
                  <Textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder={t('form.notesPlaceholder')}
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false) }}>
                    {t('actions.cancel')}
                  </Button>
                  <Button onClick={handleCreate} disabled={!isFormValid}>
                    {t('actions.create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <IBDealTable
        data={myDeals}
        onRowClick={handleRowClick}
        actions={(deal) =>
          deal.status === 'rejected' ? (
            <Button size="sm" variant="outline" onClick={() => handleResubmit(deal)}>
              {t('actions.resubmit')}
            </Button>
          ) : null
        }
      />
      <IBDealDetailDrawer
        deal={selectedDeal}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
