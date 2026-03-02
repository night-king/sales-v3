import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Globe, Users, Headset, UserCog, Shield } from 'lucide-react'
import type { Role } from '@/types/common'

const roleCards: { role: Role; icon: typeof Users; color: string }[] = [
  { role: 'sales', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { role: 'support', icon: Headset, color: 'text-green-600 bg-green-50' },
  { role: 'manager', icon: UserCog, color: 'text-purple-600 bg-purple-50' },
  { role: 'admin', icon: Shield, color: 'text-orange-600 bg-orange-50' },
]

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const language = useAuthStore((s) => s.language)
  const switchLanguage = useAuthStore((s) => s.switchLanguage)

  const handleLogin = (role: Role) => {
    login(role)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      {/* Language toggle */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4"
        onClick={() => switchLanguage(language === 'en' ? 'zh' : 'en')}
      >
        <Globe className="h-4 w-4 mr-1" />
        {language === 'en' ? '中文' : 'EN'}
      </Button>

      <div className="w-full max-w-lg">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('appName')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('login.selectRole')}
          </p>
        </div>

        {/* Role cards 2×2 */}
        <div className="grid grid-cols-2 gap-4">
          {roleCards.map(({ role, icon: Icon, color }) => (
            <Card
              key={role}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleLogin(role)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} mb-3`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t(`roles.${role}`)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {t(`roleDescriptions.${role}`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t('login.demoHint')}
        </p>
      </div>
    </div>
  )
}
