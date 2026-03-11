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
      <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] bg-mesh-dark dark:bg-mesh-dark">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar lembreteCount={lembretes.length} />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
      <ToastContainer />
      <NotificationToast lembretes={lembretes} onDismiss={dismissLembrete} />
    </div>
  )
}
