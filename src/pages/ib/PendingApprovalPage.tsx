import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useIBStore } from '@/store/ib-store'
import { PageHeader } from '@/components/common/PageHeader'
import { IBDealTable } from './components/IBDealTable'
import { IBDealDetailDrawer } from './components/IBDealDetailDrawer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IBDeal } from '@/types/ib-deal'

export default function PendingApprovalPage() {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const ibDeals = useIBStore((s) => s.ibDeals)
  const approveIBDeal = useIBStore((s) => s.approveIBDeal)
  const rejectIBDeal = useIBStore((s) => s.rejectIBDeal)

  const [selectedDeal, setSelectedDeal] = useState<IBDeal | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Reject dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectDealId, setRejectDealId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const pendingDeals = ibDeals.filter((deal) => deal.status === 'pending_approval')

  const handleRowClick = (deal: IBDeal) => {
    setSelectedDeal(deal)
    setDrawerOpen(true)
  }

  const handleApprove = (deal: IBDeal) => {
    if (!currentUser) return
    approveIBDeal(deal.id, currentUser.id)
  }

  const openRejectDialog = (deal: IBDeal) => {
    setRejectDealId(deal.id)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  const handleReject = () => {
    if (!rejectDealId || !rejectReason.trim() || !currentUser) return
    rejectIBDeal(rejectDealId, currentUser.id, rejectReason.trim())
    setRejectDialogOpen(false)
    setRejectDealId(null)
    setRejectReason('')
  }

  return (
    <div>
      <PageHeader title={t('menu:pendingApproval')} />
      <IBDealTable
        data={pendingDeals}
        onRowClick={handleRowClick}
        actions={(deal) => (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handleApprove(deal)}>
              {t('actions.approve')}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => openRejectDialog(deal)}>
              {t('actions.reject')}
            </Button>
          </div>
        )}
      />
      <IBDealDetailDrawer
        deal={selectedDeal}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('actions.reject')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>{t('form.reasonPlaceholder')}</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t('form.reasonPlaceholder')}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                {t('actions.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                {t('actions.reject')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
