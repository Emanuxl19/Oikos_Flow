'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { Nota } from '@/lib/types'
import { slideInRight } from '@/lib/animations'

interface Props {
  lembretes: Nota[]
  onDismiss: (nota: Nota) => void
}

export function NotificationToast({ lembretes, onDismiss }: Props) {
  if (lembretes.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {lembretes.slice(0, 3).map(nota => (
          <motion.div
            key={nota.id}
            {...slideInRight}
            className="glass-card-strong p-4 flex items-start gap-3 border border-primary/20 shadow-glow-sm"
          >
            <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary mb-1">
                {nota.atividadeTitulo || 'Lembrete'}
              </p>
              <p className="text-sm text-[var(--text-primary)] line-clamp-2">{nota.conteudo}</p>
            </div>
            <button
              onClick={() => onDismiss(nota)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
