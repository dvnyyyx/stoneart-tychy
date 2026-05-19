import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  variant?: 'default' | 'light'
  className?: string
  withLine?: boolean
}

export function SectionLabel({
  children,
  variant = 'default',
  className,
  withLine = false,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        'section-label',
        variant === 'light' && 'section-label--light',
        withLine && 'flex items-center gap-3',
        className
      )}
    >
      {withLine && (
        <span
          className="inline-block shrink-0"
          style={{ width: '24px', height: '1px', background: 'currentColor' }}
        />
      )}
      {children}
    </span>
  )
}
