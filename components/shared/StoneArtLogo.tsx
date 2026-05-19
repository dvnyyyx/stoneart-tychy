import { cn } from '@/lib/utils'

interface StoneArtLogoProps {
  size?: number
  variant?: 'dark' | 'light'
  className?: string
}

// SVG logo — geometryczna bryła kamienia z inicjałami SA
// Odwzorowanie znaku z materiałów drukowanych
export function StoneArtLogo({
  size = 40,
  variant = 'dark',
  className,
}: StoneArtLogoProps) {
  const strokeColor = variant === 'light' ? '#FAF8F4' : '#1E1E1E'
  const strokeOpacity = variant === 'light' ? '0.85' : '1'
  const facetOpacity  = variant === 'light' ? '0.25' : '0.2'

  return (
    <svg
      width={size}
      height={Math.round(size * 0.94)}
      viewBox="0 0 180 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/* Zewnętrzny obrys kamienia */}
      <polygon
        points="62,8 135,4 172,48 168,132 112,166 38,158 8,102 18,44"
        fill="none"
        stroke={strokeColor}
        strokeWidth="6"
        strokeOpacity={strokeOpacity}
        strokeLinejoin="round"
      />
      {/* Fakturowanie — linie wewnętrzne kamienia */}
      <line x1="62" y1="8"   x2="85"  y2="52"  stroke={strokeColor} strokeWidth="2" strokeOpacity={facetOpacity} />
      <line x1="135" y1="4"  x2="118" y2="48"  stroke={strokeColor} strokeWidth="2" strokeOpacity={facetOpacity} />
      <line x1="172" y1="48" x2="130" y2="68"  stroke={strokeColor} strokeWidth="2" strokeOpacity={facetOpacity} />
      <line x1="168" y1="132" x2="128" y2="112" stroke={strokeColor} strokeWidth="2" strokeOpacity={facetOpacity} />
      <line x1="38"  y1="158" x2="64"  y2="118" stroke={strokeColor} strokeWidth="2" strokeOpacity={facetOpacity} />
      <line x1="8"   y1="102" x2="50"  y2="92"  stroke={strokeColor} strokeWidth="2" strokeOpacity={facetOpacity} />
      <line x1="85"  y1="52"  x2="118" y2="48"  stroke={strokeColor} strokeWidth="1.5" strokeOpacity={facetOpacity} />
      <line x1="118" y1="48"  x2="130" y2="68"  stroke={strokeColor} strokeWidth="1.5" strokeOpacity={facetOpacity} />
      <line x1="85"  y1="52"  x2="64"  y2="118" stroke={strokeColor} strokeWidth="1.5" strokeOpacity={facetOpacity} />
    </svg>
  )
}
