import Image from 'next/image'
import { cn } from '@/lib/utils'

interface StoneArtLogoProps {
  size?: number
  variant?: 'dark' | 'light'
  className?: string
}

export function StoneArtLogo({
  size = 40,
  variant = 'dark',
  className,
}: StoneArtLogoProps) {
  return (
    <Image
      src="/logo/LOGOX-transparent.svg"
      alt="StoneArt logo"
      width={size}
      height={size}
      className={cn(
        'shrink-0 transition-all duration-500',
        variant === 'light' && '[filter:invert(1)]',
        className
      )}
      aria-hidden="true"
    />
  )
}
