'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToast, Toast as ToastType } from '@/providers/toast-provider'
import { slideInRight } from '@/lib/animations'
import { cn } from '@/lib/cn'

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const TOAST_COLORS = {
  success: 'border-green-500/30 text-green-400',
  error: 'border-red-500/30 text-red-400',
  info: 'border-primary/30 text-primary',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: () => void }) {
  const Icon = TOAST_ICONS[toast.type]

  return (
    <motion.div
      {...slideInRight}
      className={cn(
        'glass-card-strong p-4 flex items-start gap-3 border shadow-glow-sm',
        TOAST_COLORS[toast.type]
      )}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm flex-1 text-[var(--text-primary)]">{toast.message}</p>
      <button onClick={onDismiss} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
