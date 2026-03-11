'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { DashboardStats } from '@/lib/types'

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)

  const getStats = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<DashboardStats>('/dashboard')
      setStats(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  return { stats, loading, getStats }
}
