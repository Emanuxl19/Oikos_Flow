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
  { label: 'Configurações', icon: Settings, route: '/configuracoes' },
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
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen flex flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 overflow-hidden"
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap"
          >
            Oikos Flow
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(item => {
          const isActive = pathname === item.route || (item.route !== '/dashboard' && pathname.startsWith(item.route))
          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                'flex items-center gap-3 h-10 px-3 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary/10 text-primary shadow-glow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-dark-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[var(--border)]">
        <button
          onClick={toggle}
          className="w-full h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
