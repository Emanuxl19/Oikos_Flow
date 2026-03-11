'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { Nota } from '@/lib/types'

export function useNotas() {
  const [notas, setNotas] = useState<Nota[]>([])

  const listarPorAtividade = useCallback(async (atividadeId: number) => {
    const data = await api.get<Nota[]>(`/atividades/${atividadeId}/notas`)
    setNotas(data)
    return data
  }, [])

  const criar = useCallback(async (atividadeId: number, nota: Partial<Nota>) => {
    const created = await api.post<Nota>(`/atividades/${atividadeId}/notas`, nota)
    setNotas(prev => [created, ...prev])
    return created
  }, [])

  const atualizar = useCallback(async (notaId: number, nota: Partial<Nota>) => {
    const updated = await api.put<Nota>(`/notas/${notaId}`, nota)
    setNotas(prev => prev.map(n => n.id === notaId ? updated : n))
    return updated
  }, [])

  const deletar = useCallback(async (notaId: number) => {
    await api.delete(`/notas/${notaId}`)
    setNotas(prev => prev.filter(n => n.id !== notaId))
  }, [])

  const getLembretesAtivos = useCallback(async () => api.get<Nota[]>('/notas/lembretes'), [])

  return { notas, listarPorAtividade, criar, atualizar, deletar, getLembretesAtivos }
}
