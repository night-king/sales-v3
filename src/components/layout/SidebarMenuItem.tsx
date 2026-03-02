import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/lib/menu-config'

interface SidebarMenuItemProps {
  item: MenuItem
  collapsed: boolean
}

export function SidebarMenuItem({ item, collapsed }: SidebarMenuItemProps) {
  const { t } = useTranslation('menu')
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const Icon = item.icon
  const hasChildren = item.children && item.children.length > 0
  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((c) => location.pathname === c.path)

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open)
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-accent text-accent-foreground font-medium',
          collapsed ? 'justify-center' : 'gap-3'
        )}
        title={collapsed ? t(item.labelKey) : undefined}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{t(item.labelKey)}</span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform',
                  open && 'rotate-180'
                )}
              />
            )}
          </>
        )}
      </button>

      {/* Sub-items */}
      {hasChildren && open && !collapsed && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children!.map((child) => {
            const ChildIcon = child.icon
            const childActive = location.pathname === child.path
            return (
              <button
                key={child.key}
                onClick={() => child.path && navigate(child.path)}
                className={cn(
                  'flex items-center w-full gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  childActive && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{t(child.labelKey)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
