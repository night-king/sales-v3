import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIBStore } from '@/store/ib-store'
import { PageHeader } from '@/components/common/PageHeader'
import { IBDealTable } from './components/IBDealTable'
import { IBDealDetailDrawer } from './components/IBDealDetailDrawer'
import type { IBDeal } from '@/types/ib-deal'

export default function AllIBDealsPage() {
  const { t } = useTranslation()
  const ibDeals = useIBStore((s) => s.ibDeals)

  const [selectedDeal, setSelectedDeal] = useState<IBDeal | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleRowClick = (deal: IBDeal) => {
    setSelectedDeal(deal)
    setDrawerOpen(true)
  }

  return (
    <div>
      <PageHeader title={t('menu:allIBDeals')} />
      <IBDealTable data={ibDeals} onRowClick={handleRowClick} />
      <IBDealDetailDrawer
        deal={selectedDeal}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
