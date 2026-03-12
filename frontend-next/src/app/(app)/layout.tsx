'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { api } from '@/lib/api'
import { Nota } from '@/lib/types'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { ToastContainer } from '@/components/ui/toast'
import { Spinner } from '@/components/ui/spinner'
import { NotificationToast } from '@/components/notification-toast'

const POLL_INTERVAL_MS = 120_000

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  const [lembretes, setLembretes] = useState<Nota[]>([])

  const fetchLembretes = useCallback(async () => {
    try {
      const notas = await api.get<Nota[]>('/notas/lembretes')
      setLembretes(notas)
    } catch {}
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    fetchLembretes()
    const interval = setInterval(fetchLembretes, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isLoggedIn, fetchLembretes])

  function dismissLembrete(nota: Nota) {
    setLembretes(prev => prev.filter(n => n.id !== nota.id))
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isLoggedIn) return null

  return (
    <div className="app-shell min-h-screen bg-mesh-dark dark:bg-mesh-dark">
      <div className="relative z-10 flex min-h-screen gap-4 p-4 lg:gap-6 lg:p-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-6">
          <Topbar lembreteCount={lembretes.length} />
          <main className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="pb-10">{children}</div>
          </main>
        </div>
      </div>
      <ToastContainer />
      <NotificationToast lembretes={lembretes} onDismiss={dismissLembrete} />
    </div>
  )
}
