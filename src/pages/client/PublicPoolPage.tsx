import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { ClientTable } from './components/ClientTable'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import type { Client } from '@/types/client'

export default function PublicPoolPage() {
  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const { clients, claimClient, addClient } = useClientStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form state for creating a new client
  const [formName, setFormName] = useState('')
  const [formCountry, setFormCountry] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formEmail, setFormEmail] = useState('')

  const leadClients = clients.filter((c) => c.status === 'lead')

  const handleClaim = (clientId: string) => {
    if (currentUser) {
      claimClient(clientId, currentUser.id)
    }
  }

  const handleCreate = () => {
    if (!formName.trim()) return

    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: formName.trim(),
      country: formCountry.trim() || 'Unknown',
      language: 'en',
      phone: formPhone.trim(),
      email: formEmail.trim(),
      walletBalance: 0,
      mt5Balance: 0,
      tags: ['new_lead'],
      status: 'lead',
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id,
    }

    addClient(newClient)
    setFormName('')
    setFormCountry('')
    setFormPhone('')
    setFormEmail('')
    setDialogOpen(false)
  }

  return (
    <div>
      <PageHeader
        title={t('menu:publicPool')}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('actions.create')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('actions.create')} {t('menu:client')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('table.name')}</Label>
                  <Input
                    placeholder={t('form.namePlaceholder')}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('table.country')}</Label>
                  <Input
                    placeholder={t('table.country')}
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('table.phone')}</Label>
                  <Input
                    placeholder={t('form.phonePlaceholder')}
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('table.email')}</Label>
                  <Input
                    placeholder={t('form.emailPlaceholder')}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {t('actions.cancel')}
                  </Button>
                  <Button onClick={handleCreate}>
                    {t('actions.submit')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <ClientTable
        data={leadClients}
        actions={(client) => (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleClaim(client.id)
            }}
          >
            {t('actions.claim')}
          </Button>
        )}
      />
    </div>
  )
}
