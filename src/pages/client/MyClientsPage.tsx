import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { ClientTable } from './components/ClientTable'
import { Button } from '@/components/ui/button'

export default function MyClientsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.currentUser)
  const { clients, releaseClient } = useClientStore()

  const userId = currentUser?.id ?? ''
  const myClients = clients.filter((c) => c.assignedTo === userId)

  return (
    <div>
      <PageHeader title={t('menu:myClients')} />
      <ClientTable
        data={myClients}
        onRowClick={(client) => navigate(`/client/${client.id}`)}
        actions={(client) => (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              releaseClient(client.id)
            }}
          >
            {t('actions.release')}
          </Button>
        )}
      />
    </div>
  )
}
