import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleBadge } from '@/components/common/RoleBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { User, Globe, Bell } from 'lucide-react'
import { LANGUAGES, REGIONS, USER_STATUSES } from '@/lib/constants'

export default function UserProfilePage() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const { currentUser, language, switchLanguage } = useAuthStore()

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Not logged in</p>
      </div>
    )
  }

  const status = USER_STATUSES.find((s) => s.value === currentUser.status)

  return (
    <div>
      <PageHeader title={t('menu:userProfile')} />

      <div className="space-y-6 max-w-2xl">
        {/* Personal Info */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">{t('table.name')}</Label>
                <p className="font-medium">{currentUser.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Username</Label>
                <p className="font-medium">{currentUser.username}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">{t('table.email')}</Label>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">{t('menu:role')}</Label>
                <div className="mt-1">
                  <RoleBadge role={currentUser.role} />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">{t('table.status')}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`h-2 w-2 rounded-full ${status?.dotColor ?? 'bg-gray-400'}`} />
                  <span>{isZh ? status?.labelZh : status?.labelEn}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Max Tasks</Label>
                <p className="font-medium">{currentUser.maxTaskCapacity}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground text-xs">{t('table.language')}</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentUser.languages.map((lang) => {
                  const langInfo = LANGUAGES.find((l) => l.value === lang)
                  return (
                    <Badge key={lang} variant="secondary">
                      {langInfo?.label ?? lang}
                    </Badge>
                  )
                })}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">Regions</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentUser.regions.map((region) => {
                  const regionInfo = REGIONS.find((r) => r.value === region)
                  return (
                    <Badge key={region} variant="outline">
                      {isZh ? regionInfo?.labelZh : regionInfo?.labelEn}
                    </Badge>
                  )
                })}
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">Skills</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentUser.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Preference */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Language Preference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {language === 'en' ? 'English' : '中文'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Switch between English and Chinese interface
                </p>
              </div>
              <Switch
                checked={language === 'zh'}
                onCheckedChange={(checked) =>
                  switchLanguage(checked ? 'zh' : 'en')
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: 'Task Assignments',
                description: 'Notify when new tasks are assigned to you',
                defaultChecked: true,
              },
              {
                label: 'Client Updates',
                description: 'Notify on client status changes',
                defaultChecked: true,
              },
              {
                label: 'Ticket Alerts',
                description: 'Notify when tickets require attention',
                defaultChecked: true,
              },
              {
                label: 'IB Deal Updates',
                description: 'Notify on IB deal status changes',
                defaultChecked: false,
              },
              {
                label: 'System Announcements',
                description: 'Receive system-wide announcements',
                defaultChecked: true,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
