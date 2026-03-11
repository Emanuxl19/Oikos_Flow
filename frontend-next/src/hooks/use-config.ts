'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { Configuracao } from '@/lib/types'

export function useConfig() {
  const [config, setConfig] = useState<Configuracao>({})
  const [loading, setLoading] = useState(false)

  const getConfig = useCallback(async () => {
    setLoading(true)
    try { setConfig(await api.get<Configuracao>('/configuracao')) }
    catch {} finally { setLoading(false) }
  }, [])

  const salvar = useCallback(async (dados: Configuracao) => api.put<{ mensagem: string }>('/configuracao', dados), [])
  const testarTelegram = useCallback(async () => api.post<{ sucesso: boolean; mensagem: string }>('/configuracao/testar-telegram'), [])

  return { config, setConfig, loading, getConfig, salvar, testarTelegram }
}
