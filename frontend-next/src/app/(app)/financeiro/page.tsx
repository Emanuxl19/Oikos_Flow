'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Wallet, Plus, Trash2,
  ChevronLeft, ChevronRight, Edit3, X, Save,
} from 'lucide-react'
import { useTransacoes } from '@/hooks/use-transacoes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { DoughnutChart } from '@/components/charts/doughnut-chart'
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '@/lib/constants'
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations'
import { useToast } from '@/providers/toast-provider'
import type { TipoTransacao, Transacao } from '@/lib/types'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const CATEGORIA_COLORS: Record<string, string> = {
  'Alimentação': '#EA580C', 'Transporte': '#F97316', 'Moradia': '#FACC15',
  'Saúde': '#10b981', 'Educação': '#6366f1', 'Lazer': '#8b5cf6',
  'Roupas': '#ec4899', 'Serviços': '#38bdf8', 'Outros': '#94a3b8',
  'Salário': '#10b981', 'Freelance': '#6366f1', 'Investimentos': '#FACC15',
  'Aluguel': '#F97316', 'Bônus': '#EA580C',
}

export default function FinanceiroPage() {
  const { transacoes, resumo, loading, listarMes, carregarResumo, criar, atualizar, deletar } = useTransacoes()
  const { addToast } = useToast()

  const now = new Date()
  const [ano, setAno] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'DESPESA' as TipoTransacao,
    categoria: '',
    data: new Date().toISOString().slice(0, 10),
    observacao: '',
  })

  useEffect(() => {
    listarMes(ano, mes)
    carregarResumo(ano, mes)
  }, [ano, mes, listarMes, carregarResumo])

  const categorias = form.tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  const navMes = (dir: number) => {
    let novoMes = mes + dir
    let novoAno = ano
    if (novoMes < 1) { novoMes = 12; novoAno-- }
    if (novoMes > 12) { novoMes = 1; novoAno++ }
    setMes(novoMes)
    setAno(novoAno)
  }

  const resetForm = () => {
    setForm({ descricao: '', valor: '', tipo: 'DESPESA', categoria: '', data: new Date().toISOString().slice(0, 10), observacao: '' })
    setEditandoId(null)
    setMostrarForm(false)
  }

  const startEditar = (t: Transacao) => {
    setForm({
      descricao: t.descricao,
      valor: t.valor.toString(),
      tipo: t.tipo,
      categoria: t.categoria || '',
      data: t.data.slice(0, 10),
      observacao: t.observacao || '',
    })
    setEditandoId(t.id!)
    setMostrarForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descricao.trim() || !form.valor) {
      addToast('Preencha descrição e valor', 'error')
      return
    }
    try {
      const dados = {
        descricao: form.descricao,
        valor: Number(form.valor),
        tipo: form.tipo,
        categoria: form.categoria || undefined,
        data: form.data,
        observacao: form.observacao || undefined,
      }
      if (editandoId) {
        await atualizar(editandoId, dados)
        addToast('Transação atualizada!', 'success')
      } else {
        await criar(dados)
        addToast('Transação criada!', 'success')
      }
      resetForm()
      listarMes(ano, mes)
      carregarResumo(ano, mes)
    } catch {
      addToast('Erro ao salvar transação', 'error')
    }
  }

  const handleDeletar = async (id: number) => {
    try {
      await deletar(id)
      addToast('Transação removida', 'success')
      listarMes(ano, mes)
      carregarResumo(ano, mes)
      setConfirmDeleteId(null)
    } catch {
      addToast('Erro ao remover', 'error')
    }
  }

  const despesaChartData = useMemo(() => {
    const entries = Object.entries(resumo.despesasPorCategoria)
    return {
      labels: entries.map(([k]) => k),
      data: entries.map(([, v]) => v),
      colors: entries.map(([k]) => CATEGORIA_COLORS[k] || '#94a3b8'),
    }
  }, [resumo.despesasPorCategoria])

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <motion.div {...pageTransition} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Financeiro</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Controle de receitas e despesas</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Month nav */}
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-xl px-2 py-1">
            <button onClick={() => navMes(-1)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <span className="text-sm font-medium text-[var(--text-primary)] min-w-[140px] text-center">
              {MESES[mes - 1]} {ano}
            </span>
            <button onClick={() => navMes(1)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>
          <Button onClick={() => { resetForm(); setMostrarForm(!mostrarForm) }}>
            {mostrarForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mostrarForm ? 'Fechar' : 'Nova'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div {...staggerItem}>
          <Card glow className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Receitas</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(resumo.receitas)}</p>
            </div>
          </Card>
        </motion.div>
        <motion.div {...staggerItem}>
          <Card glow className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Despesas</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(resumo.despesas)}</p>
            </div>
          </Card>
        </motion.div>
        <motion.div {...staggerItem}>
          <Card glow className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Saldo</p>
              <p className={`text-xl font-bold ${resumo.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(resumo.saldo)}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Form */}
      {mostrarForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              {editandoId ? 'Editar Transação' : 'Nova Transação'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Descrição *"
                  placeholder="Ex: Supermercado"
                  value={form.descricao}
                  onChange={e => setForm(prev => ({ ...prev, descricao: e.target.value }))}
                />
                <Input
                  type="number"
                  label="Valor (R$) *"
                  placeholder="0.00"
                  step="0.01"
                  value={form.valor}
                  onChange={e => setForm(prev => ({ ...prev, valor: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Tipo"
                  value={form.tipo}
                  onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value as TipoTransacao, categoria: '' }))}
                  options={[
                    { value: 'DESPESA', label: 'Despesa' },
                    { value: 'RECEITA', label: 'Receita' },
                  ]}
                />
                <Select
                  label="Categoria"
                  placeholder="Selecione"
                  value={form.categoria}
                  onChange={e => setForm(prev => ({ ...prev, categoria: e.target.value }))}
                  options={categorias.map(c => ({ value: c, label: c }))}
                />
                <Input
                  type="date"
                  label="Data"
                  value={form.data}
                  onChange={e => setForm(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              <Input
                label="Observação"
                placeholder="Opcional"
                value={form.observacao}
                onChange={e => setForm(prev => ({ ...prev, observacao: e.target.value }))}
              />
              <div className="flex items-center gap-3">
                <Button type="submit">
                  <Save className="w-4 h-4" /> {editandoId ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Transações ({transacoes.length})
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner className="w-6 h-6" />
              </div>
            ) : transacoes.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">
                Nenhuma transação neste mês
              </p>
            ) : (
              <div className="space-y-2">
                {transacoes.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${t.tipo === 'RECEITA' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{t.descricao}</p>
                        {t.categoria && <Badge value={t.tipo} label={t.categoria} />}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(t.data).toLocaleDateString('pt-BR')}
                        {t.observacao && ` — ${t.observacao}`}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold shrink-0 ${t.tipo === 'RECEITA' ? 'text-green-400' : 'text-red-400'}`}>
                      {t.tipo === 'RECEITA' ? '+' : '-'}{formatCurrency(t.valor)}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditar(t)}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      </button>
                      {confirmDeleteId === t.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDeletar(t.id!)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]">
                            <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(t.id!)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Breakdown Chart */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Despesas por Categoria
            </h3>
            {despesaChartData.data.length > 0 ? (
              <div className="h-64">
                <DoughnutChart {...despesaChartData} />
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">
                Sem despesas neste mês
              </p>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
