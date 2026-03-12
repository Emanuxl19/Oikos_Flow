'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'Atividades', icon: ClipboardList, route: '/atividades' },
  { label: 'Nova Atividade', icon: PlusCircle, route: '/atividades/nova' },
  { label: 'Financeiro', icon: Wallet, route: '/financeiro' },
  { label: 'Configuracoes', icon: Settings, route: '/configuracoes' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  function toggle() {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 96 : 292 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="relative flex h-[calc(100vh-2rem)] shrink-0 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,24,27,0.96),rgba(10,13,15,0.92))] p-3 shadow-[0_32px_90px_rgba(0,0,0,0.36)]"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(226,155,69,0.24),transparent_72%)] blur-3xl" />

      <div className="relative flex h-full w-full flex-col">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
          {!collapsed && <div className="section-kicker mb-3">Control room</div>}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-gradient-primary shadow-glow-sm">
              <Rocket className="h-5 w-5 text-[#171310]" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <p className="font-display text-[1.65rem] tracking-[-0.08em] text-accent">Oikos Flow</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
                  Ops cockpit
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="px-2 pt-6">
          {!collapsed && <p className="section-kicker">Workspace</p>}
        </div>

        <nav className="mt-4 flex-1 space-y-2">
          {navItems.map(item => {
            const isActive =
              pathname === item.route ||
              (item.route !== '/dashboard' && pathname.startsWith(item.route))

            return (
              <Link
                key={item.route}
                href={item.route}
                className={cn(
                  'group relative flex h-12 items-center gap-3 overflow-hidden rounded-[20px] px-4 text-sm transition-all duration-300',
                  isActive
                    ? 'bg-white/[0.08] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_rgba(0,0,0,0.2)]'
                    : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
                )}
              >
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {collapsed && (
                  <div className="pointer-events-none absolute left-full ml-3 rounded-xl border border-white/10 bg-[#15191b] px-3 py-2 text-xs font-medium text-accent opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-3">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Modo foco</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Navegacao limpa e espaco para o conteudo principal respirar.
              </p>
            </div>
          )}
          <button
            onClick={toggle}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.05] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span className="text-sm font-medium">Recolher</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
