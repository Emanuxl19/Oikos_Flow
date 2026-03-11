import { cn } from '@/lib/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin',
        className
      )}
    />
  )
}
