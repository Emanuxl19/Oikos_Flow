'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plus, Search, Filter, Calendar, AlertTriangle,
  List, Clock, CheckCircle2, XCircle, Sparkles,
} from 'lucide-react'
import { useAtividades } from '@/hooks/use-atividades'
import { useDebounce } from '@/hooks/use-debounce'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { TIPO_LABEL, PRIORIDADE_LABEL, STATUS_LABEL, TIPOS, PRIORIDADES, STATUSES } from '@/lib/constants'
import { pageTransition, staggerContainer, staggerItem, cardHover } from '@/lib/animations'
import type { TipoAtividade, StatusAtividade, Prioridade } from '@/lib/types'

type Tab = 'todas' | 'hoje' | 'atrasadas'

const STATUS_ICON: Record<string, typeof Clock> = {
  PENDENTE: Clock,
  EM_ANDAMENTO: List,
  CONCLUIDA: CheckCircle2,
  CANCELADA: XCircle,
}

function prazoRelativo(prazo?: string): string {
  if (!prazo) return ''
  const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d atrasada`
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  return `em ${diff} dias`
}

export default function AtividadesPage() {
  const { atividades, loading, listar, hoje, atrasadas, buscar } = useAtividades()

  const [tab, setTab] = useState<Tab>('todas')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroPrioridade, setFiltroPrioridade] = useState('')
  const [termoBusca, setTermoBusca] = useState('')
  const [useAI, setUseAI] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const buscaDebounced = useDebounce(termoBusca, 400)

  useEffect(() => {
    if (buscaDebounced) {
      buscar(buscaDebounced, useAI)
      return
    }
    if (tab === 'hoje') hoje()
    else if (tab === 'atrasadas') atrasadas()
    else listar({
      tipo: filtroTipo as TipoAtividade || undefined,
      status: filtroStatus as StatusAtividade || undefined,
      prioridade: filtroPrioridade as Prioridade || undefined,
    })
  }, [tab, filtroTipo, filtroStatus, filtroPrioridade, buscaDebounced, useAI, listar, hoje, atrasadas, buscar])

  const tabs: { key: Tab; label: string; icon: typeof List }[] = [
    { key: 'todas', label: 'Todas', icon: List },
    { key: 'hoje', label: 'Hoje', icon: Calendar },
    { key: 'atrasadas', label: 'Atrasadas', icon: AlertTriangle },
  ]

  return (
    <motion.div {...pageTransition} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Atividades</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {atividades.length} atividade{atividades.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/atividades/nova">
          <Button>
            <Plus className="w-4 h-4" /> Nova Atividade
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-secondary)] w-fit">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setTermoBusca('') }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-gradient-primary text-white shadow-glow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Buscar atividades..."
            value={termoBusca}
            onChange={e => setTermoBusca(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
          />
        </div>
        <button
          onClick={() => setUseAI(!useAI)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            useAI
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
          }`}
          title="Busca com IA"
        >
          <Sparkles className="w-4 h-4" />
          IA
        </button>
        <Button variant="secondary" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
          <Filter className="w-4 h-4" /> Filtros
        </Button>
      </div>

      {/* Filters */}
      {mostrarFiltros && tab === 'todas' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <Select
            label="Tipo"
            placeholder="Todos os tipos"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            options={TIPOS.map(t => ({ value: t, label: TIPO_LABEL[t] }))}
          />
          <Select
            label="Status"
            placeholder="Todos os status"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            options={STATUSES.map(s => ({ value: s, label: STATUS_LABEL[s] }))}
          />
          <Select
            label="Prioridade"
            placeholder="Todas"
            value={filtroPrioridade}
            onChange={e => setFiltroPrioridade(e.target.value)}
            options={PRIORIDADES.map(p => ({ value: p, label: PRIORIDADE_LABEL[p] }))}
          />
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {atividades.map(atv => {
            const StatusIcon = STATUS_ICON[atv.status] || Clock
            return (
              <motion.div key={atv.id} {...staggerItem}>
                <Link href={`/atividades/${atv.id}/editar`}>
                  <motion.div {...cardHover}>
                    <Card glow className="cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge value={atv.tipo} label={TIPO_LABEL[atv.tipo]} />
                          <Badge value={atv.prioridade} label={PRIORIDADE_LABEL[atv.prioridade]} />
                        </div>
                        <StatusIcon className={`w-4 h-4 shrink-0 ${
                          atv.status === 'CONCLUIDA' ? 'text-green-400' :
                          atv.status === 'EM_ANDAMENTO' ? 'text-blue-400' :
                          atv.status === 'CANCELADA' ? 'text-slate-400' : 'text-amber-400'
                        }`} />
                      </div>

                      <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1 mb-1">
                        {atv.titulo}
                      </h3>

                      {atv.descricao && (
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                          {atv.descricao}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <Badge value={atv.status} label={STATUS_LABEL[atv.status]} />
                        {atv.prazo && (
                          <span className={
                            new Date(atv.prazo) < new Date() && atv.status !== 'CONCLUIDA'
                              ? 'text-red-400 font-medium'
                              : ''
                          }>
                            {prazoRelativo(atv.prazo)}
                          </span>
                        )}
                      </div>

                      {atv.notas && atv.notas.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-[var(--border)]">
                          <span className="text-xs text-[var(--text-muted)]">
                            {atv.notas.length} nota{atv.notas.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && atividades.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <List className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
            Nenhuma atividade encontrada
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {termoBusca ? 'Tente buscar com outros termos' : 'Crie sua primeira atividade para começar'}
          </p>
          {!termoBusca && (
            <Link href="/atividades/nova">
              <Button>
                <Plus className="w-4 h-4" /> Criar Atividade
              </Button>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  )
}
