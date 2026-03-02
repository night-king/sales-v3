import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { ClientTable } from './components/ClientTable'

export default function ClientsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const clients = useClientStore((s) => s.clients)

  // Show all non-lead clients
  const nonLeadClients = clients.filter((c) => c.status !== 'lead')

  return (
    <div>
      <PageHeader title={t('menu:clients')} />
      <ClientTable
        data={nonLeadClients}
        onRowClick={(client) => navigate(`/client/${client.id}`)}
      />
    </div>
  )
}
