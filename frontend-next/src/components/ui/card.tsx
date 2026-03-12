import { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ className, glow, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6',
        glow && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
