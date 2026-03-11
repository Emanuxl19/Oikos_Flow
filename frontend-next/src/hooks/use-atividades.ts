'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { Atividade, TipoAtividade, StatusAtividade, Prioridade } from '@/lib/types'

interface Filtros {
  tipo?: TipoAtividade
  status?: StatusAtividade
  prioridade?: Prioridade
}

export function useAtividades() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loading, setLoading] = useState(false)

  const listar = useCallback(async (filtros?: Filtros) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtros?.tipo) params.set('tipo', filtros.tipo)
      if (filtros?.status) params.set('status', filtros.status)
      if (filtros?.prioridade) params.set('prioridade', filtros.prioridade)
      const qs = params.toString()
      const data = await api.get<Atividade[]>(`/atividades${qs ? `?${qs}` : ''}`)
      setAtividades(data)
    } catch {} finally { setLoading(false) }
  }, [])

  const hoje = useCallback(async () => {
    setLoading(true)
    try { setAtividades(await api.get<Atividade[]>('/atividades/hoje')) }
    catch {} finally { setLoading(false) }
  }, [])

  const atrasadas = useCallback(async () => {
    setLoading(true)
    try { setAtividades(await api.get<Atividade[]>('/atividades/atrasadas')) }
    catch {} finally { setLoading(false) }
  }, [])

  const buscar = useCallback(async (q: string, useAI: boolean) => {
    setLoading(true)
    try { setAtividades(await api.get<Atividade[]>(`/atividades/busca?q=${encodeURIComponent(q)}&useAI=${useAI}`)) }
    catch {} finally { setLoading(false) }
  }, [])

  const buscarPorId = useCallback(async (id: number) => api.get<Atividade>(`/atividades/${id}`), [])
  const criar = useCallback(async (dados: Partial<Atividade>) => api.post<Atividade>('/atividades', dados), [])
  const atualizar = useCallback(async (id: number, dados: Partial<Atividade>) => api.put<Atividade>(`/atividades/${id}`, dados), [])
  const concluir = useCallback(async (id: number) => api.patch<Atividade>(`/atividades/${id}/concluir`), [])
  const deletar = useCallback(async (id: number) => api.delete(`/atividades/${id}`), [])

  return { atividades, loading, listar, hoje, atrasadas, buscar, buscarPorId, criar, atualizar, concluir, deletar }
}
