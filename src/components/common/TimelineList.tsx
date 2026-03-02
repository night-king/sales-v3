import { cn } from '@/lib/utils'

interface TimelineEntry {
  id: string
  timestamp: string
  actor: string
  content: string
  type?: 'default' | 'success' | 'warning' | 'error'
}

interface TimelineListProps {
  entries: TimelineEntry[]
  className?: string
}

const dotColors: Record<string, string> = {
  default: 'bg-muted-foreground',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

export function TimelineList({ entries, className }: TimelineListProps) {
  if (entries.length === 0) return null

  return (
    <div className={cn('space-y-4', className)}>
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5', dotColors[entry.type ?? 'default'])} />
            {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{entry.actor}</span>
              <span className="text-muted-foreground text-xs">{entry.timestamp}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{entry.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export type { TimelineEntry }
