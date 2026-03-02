import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Save, Plug, MessageSquare } from 'lucide-react'

export default function SystemSettingsPage() {
  const { t } = useTranslation()

  const handleSave = () => {
    alert('Settings saved (demo only)')
  }

  return (
    <div>
      <PageHeader
        title={t('menu:systemSettings')}
        actions={
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {t('actions.save')}
          </Button>
        }
      />

      <div className="space-y-6">
        {/* External Integration */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Plug className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">External Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>RabbitMQ URL</Label>
                <Input defaultValue="amqp://rabbitmq.speccapitals.internal:5672" />
              </div>
              <div className="space-y-2">
                <Label>CRM API URL</Label>
                <Input defaultValue="https://crm-api.speccapitals.com/v2" />
              </div>
              <div className="space-y-2">
                <Label>MT5 API URL</Label>
                <Input defaultValue="https://mt5-api.speccapitals.com/v1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Communication Channels */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Communication Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LiveChat API Key</Label>
                <Input defaultValue="lc-key-xxxx-xxxx-xxxx-xxxx" type="password" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Token</Label>
                <Input defaultValue="wa-token-xxxx-xxxx-xxxx" type="password" />
              </div>
              <div className="space-y-2">
                <Label>Email SMTP Host</Label>
                <Input defaultValue="smtp.speccapitals.com" />
              </div>
              <div className="space-y-2">
                <Label>Email SMTP Port</Label>
                <Input defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label>Email SMTP Username</Label>
                <Input defaultValue="notifications@speccapitals.com" />
              </div>
              <div className="space-y-2">
                <Label>Email SMTP Password</Label>
                <Input defaultValue="smtp-password-placeholder" type="password" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
