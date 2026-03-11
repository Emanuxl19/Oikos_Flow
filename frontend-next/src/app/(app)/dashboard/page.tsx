'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  TrendingUp, Clock, RefreshCw, CheckCircle2,
  AlertTriangle, Bell, ArrowRight,
} from 'lucide-react'
import { useDashboard } from '@/hooks/use-dashboard'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { DoughnutChart } from '@/components/charts/doughnut-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { TIPO_LABEL, PRIORIDADE_LABEL } from '@/lib/constants'
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations'
import type { TipoAtividade, Prioridade } from '@/lib/types'

const STAT_ICONS = [TrendingUp, Clock, RefreshCw, CheckCircle2, AlertTriangle, Bell]

function prazoRelativo(prazo?: string): string {
  if (!prazo) return ''
  const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d atrasada`
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  return `em ${diff} dias`
}

export default function DashboardPage() {
  const { stats, loading, getStats } = useDashboard()

  useEffect(() => { getStats() }, [getStats])

  const statCards = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Total', value: stats.totalAtividades, delta: '+12%' },
      { label: 'Pendentes', value: stats.pendentes, delta: `${stats.hoje} hoje` },
      { label: 'Em andamento', value: stats.emAndamento, delta: 'Em fluxo' },
      { label: 'Concluídas', value: stats.concluidas, delta: 'Meta ativa' },
      { label: 'Atrasadas', value: stats.atrasadas, delta: 'Priorizar' },
      { label: 'Lembretes', value: stats.lembretesPendentes, delta: 'Automação' },
    ]
  }, [stats])

  const workflowRows = useMemo(() => {
    if (!stats) return []
    const total = Math.max(stats.totalAtividades, 1)
    return [
      { label: 'Pendentes', value: stats.pendentes, percent: (stats.pendentes / total) * 100, color: '#f59e0b' },
      { label: 'Em andamento', value: stats.emAndamento, percent: (stats.emAndamento / total) * 100, color: '#38bdf8' },
      { label: 'Concluídas', value: stats.concluidas, percent: (stats.concluidas / total) * 100, color: '#10b981' },
      { label: 'Atrasadas', value: stats.atrasadas, percent: (stats.atrasadas / total) * 100, color: '#ef4444' },
    ]
  }, [stats])

  const tipoChartData = useMemo(() => {
    if (!stats) return { labels: [], data: [], colors: [] }
    return {
      labels: Object.keys(stats.porTipo).map(k => TIPO_LABEL[k as TipoAtividade] || k),
      data: Object.values(stats.porTipo),
      colors: ['#EA580C', '#F97316', '#FACC15'],
    }
  }, [stats])

  const prioridadeChartData = useMemo(() => {
    if (!stats) return { labels: [], data: [], colors: [] }
    return {
      labels: Object.keys(stats.porPrioridade).map(k => PRIORIDADE_LABEL[k as Prioridade] || k),
      data: Object.values(stats.porPrioridade),
      colors: ['#a3e635', '#f59e0b', '#f97316', '#ef4444'],
    }
  }, [stats])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <motion.div {...pageTransition} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Visão geral das suas atividades</p>
      </div>

      {/* KPI Cards */}
      <motion.div
        {...staggerContainer}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {statCards.map((card, i) => {
          const Icon = STAT_ICONS[i]
          return (
            <motion.div key={card.label} {...staggerItem}>
              <Card glow className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-[var(--text-muted)]">{card.delta}</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{card.label}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Próximas Atividades */}
      {stats?.proximasAtividades && stats.proximasAtividades.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Próximas Atividades</h2>
            <Link href="/atividades" className="text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stats.proximasAtividades.slice(0, 5).map(atv => (
              <Link
                key={atv.id}
                href={`/atividades/${atv.id}/editar`}
                className="shrink-0 w-64"
              >
                <Card glow className="hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge value={atv.tipo} label={TIPO_LABEL[atv.tipo]} />
                    <Badge value={atv.prioridade} label={PRIORIDADE_LABEL[atv.prioridade]} />
                  </div>
                  <p className="font-medium text-sm text-[var(--text-primary)] line-clamp-1">{atv.titulo}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{prazoRelativo(atv.prazo)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Por Tipo</h3>
          <div className="h-64">
            <DoughnutChart {...tipoChartData} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Por Prioridade</h3>
          <div className="h-64">
            <BarChart {...prioridadeChartData} />
          </div>
        </Card>
      </div>

      {/* Pipeline */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Pipeline</h3>
        <div className="space-y-3">
          {workflowRows.map(row => (
            <div key={row.label} className="flex items-center gap-4">
              <span className="text-xs text-[var(--text-secondary)] w-24">{row.label}</span>
              <div className="flex-1 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                />
              </div>
              <span className="text-xs font-medium text-[var(--text-primary)] w-8 text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
