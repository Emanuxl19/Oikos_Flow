'use client'

import { useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { Transacao, ResumoFinanceiro } from '@/lib/types'

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [resumo, setResumo] = useState<ResumoFinanceiro>({ receitas: 0, despesas: 0, saldo: 0, despesasPorCategoria: {} })
  const [loading, setLoading] = useState(false)

  const listarMes = useCallback(async (ano: number, mes: number) => {
    setLoading(true)
    try { setTransacoes(await api.get<Transacao[]>(`/transacoes/mes?ano=${ano}&mes=${mes}`)) }
    catch {} finally { setLoading(false) }
  }, [])

  const carregarResumo = useCallback(async (ano: number, mes: number) => {
    try { setResumo(await api.get<ResumoFinanceiro>(`/transacoes/resumo?ano=${ano}&mes=${mes}`)) } catch {}
  }, [])

  const criar = useCallback(async (dados: Partial<Transacao>) => api.post<Transacao>('/transacoes', dados), [])
  const atualizar = useCallback(async (id: number, dados: Partial<Transacao>) => api.put<Transacao>(`/transacoes/${id}`, dados), [])
  const deletar = useCallback(async (id: number) => api.delete(`/transacoes/${id}`), [])

  return { transacoes, resumo, loading, listarMes, carregarResumo, criar, atualizar, deletar }
}
