import { cn } from '@/lib/utils'
import { SectionLabel } from './SectionLabel'

interface PageHeaderProps {
  label?: string
  title: string
  lead?: string
  className?: string
  centered?: boolean
}

export function PageHeader({
  label,
  title,
  lead,
  className,
  centered = false,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'pt-[140px] pb-16 lg:pb-20 container-stone',
        centered && 'text-center',
        className
      )}
    >
      {label && (
        <SectionLabel className={cn(centered && 'justify-center')}>
          {label}
        </SectionLabel>
      )}
      <h1
        className="font-display text-display-lg text-ink max-w-[640px] leading-[1.08]"
        style={centered ? { marginLeft: 'auto', marginRight: 'auto' } : {}}
      >
        {title}
      </h1>
      {lead && (
        <p
          className="mt-5 text-body-lg text-ink-secondary max-w-[520px] leading-[1.75]"
          style={centered ? { marginLeft: 'auto', marginRight: 'auto' } : {}}
        >
          {lead}
        </p>
      )}
      <div className="bar-motif mt-8">
        <div className="bar-motif__dark" />
        <div className="bar-motif__gold" />
      </div>
    </div>
  )
}
