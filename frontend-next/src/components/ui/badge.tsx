import { cn } from '@/lib/cn'

const BADGE_COLORS: Record<string, string> = {
  URGENTE: 'bg-red-500/15 text-red-400 border-red-500/20',
  ALTA: 'bg-red-500/15 text-red-400 border-red-500/20',
  MEDIA: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  BAIXA: 'bg-green-500/15 text-green-400 border-green-500/20',
  PENDENTE: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  EM_ANDAMENTO: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  CONCLUIDA: 'bg-green-500/15 text-green-400 border-green-500/20',
  CANCELADA: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  ESCOLAR: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  FINANCEIRO: 'bg-primary/15 text-primary border-primary/20',
  GERAL: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  RECEITA: 'bg-green-500/15 text-green-400 border-green-500/20',
  DESPESA: 'bg-red-500/15 text-red-400 border-red-500/20',
}

export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border',
        BADGE_COLORS[value] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'
      )}
    >
      {label || value}
    </span>
  )
}
