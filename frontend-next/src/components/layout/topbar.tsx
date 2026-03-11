'use client'

import { Bell, LogOut, Search } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { ThemeToggle } from './theme-toggle'

interface TopbarProps {
  lembreteCount?: number
}

export function Topbar({ lembreteCount = 0 }: TopbarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full h-9 pl-10 pr-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors">
          <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
          {lembreteCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-primary text-[10px] text-white font-bold flex items-center justify-center">
              {lembreteCount > 9 ? '9+' : lembreteCount}
            </span>
          )}
        </button>

        <ThemeToggle />

        {/* User */}
        {user && (
          <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-xs text-white font-bold">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{user.nome}</span>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
