import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { usePermission } from '@/hooks/use-permission'
import { SidebarMenuItem } from './SidebarMenuItem'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation()
  const { getMenuItems } = usePermission()
  const menuItems = getMenuItems()

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-4 border-b">
        {!collapsed && (
          <span className="font-semibold text-sm truncate">
            {t('appName')}
          </span>
        )}
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.key}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Collapse toggle */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 mr-2" />
              <span className="text-xs">{t('actions.collapse')}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
