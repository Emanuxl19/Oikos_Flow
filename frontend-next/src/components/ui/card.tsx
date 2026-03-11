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
        glow && 'shadow-glow-sm hover:shadow-glow transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
