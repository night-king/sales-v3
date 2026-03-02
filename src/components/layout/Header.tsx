import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Bell, ChevronDown, LogOut, Users, Headset, UserCog, Shield } from 'lucide-react'
import type { Role } from '@/types/common'

const roleIcons: Record<Role, typeof Users> = {
  sales: Users,
  support: Headset,
  manager: UserCog,
  admin: Shield,
}

const roleColors: Record<Role, string> = {
  sales: 'bg-blue-100 text-blue-700',
  support: 'bg-green-100 text-green-700',
  manager: 'bg-purple-100 text-purple-700',
  admin: 'bg-orange-100 text-orange-700',
}

const allRoles: Role[] = ['sales', 'support', 'manager', 'admin']

export function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.currentUser)
  const currentRole = useAuthStore((s) => s.currentRole)
  const language = useAuthStore((s) => s.language)
  const switchLanguage = useAuthStore((s) => s.switchLanguage)
  const switchRole = useAuthStore((s) => s.switchRole)
  const logout = useAuthStore((s) => s.logout)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const RoleIcon = roleIcons[currentRole]

  const handleSwitchRole = (role: Role) => {
    switchRole(role)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b bg-card">
      {/* Left: breadcrumb area (placeholder) */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => switchLanguage(language === 'en' ? 'zh' : 'en')}
        >
          <Globe className="h-4 w-4 mr-1" />
          {language === 'en' ? '中文' : 'EN'}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded ${roleColors[currentRole]}`}>
                <RoleIcon className="h-3 w-3" />
              </span>
              <span className="text-sm">{t(`roles.${currentRole}`)}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allRoles.map((role) => {
              const Icon = roleIcons[role]
              return (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  className={role === currentRole ? 'bg-accent' : ''}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {t(`roles.${role}`)}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('actions.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        {currentUser && (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  )
}
