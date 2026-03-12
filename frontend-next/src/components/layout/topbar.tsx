'use client'

import { Bell, LogOut, Search, Sparkles } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { ThemeToggle } from './theme-toggle'

interface TopbarProps {
  lembreteCount?: number
}

export function Topbar({ lembreteCount = 0 }: TopbarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="glass-card-strong relative overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="section-kicker mb-3">Workspace pulse</div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1 lg:max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Buscar por atividade, nota ou categoria..."
                className="h-12 w-full rounded-[18px] border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none"
              />
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {lembreteCount > 0 ? `${lembreteCount} lembretes ativos` : 'Fluxo monitorado'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 xl:justify-end">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            <Bell className="h-4 w-4" />
            {lembreteCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-primary px-1 text-[10px] font-bold text-[#171310]">
                {lembreteCount > 9 ? '9+' : lembreteCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {user && (
            <div className="flex min-w-0 items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-primary text-sm font-bold text-[#171310]">
                {user.nome.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user.nome}</p>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  Workspace owner
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] text-[var(--text-muted)] transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
