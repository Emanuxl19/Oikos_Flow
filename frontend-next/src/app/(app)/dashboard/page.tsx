'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Layers3,
  Wallet,
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

function prazoRelativo(prazo?: string): string {
  if (!prazo) return 'Sem prazo'
  const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d atrasada`
  if (diff === 0) return 'Entrega hoje'
  if (diff === 1) return 'Entrega amanha'
  return `Entrega em ${diff} dias`
}

export default function DashboardPage() {
  const { stats, loading, getStats } = useDashboard()

  useEffect(() => {
    getStats()
  }, [getStats])

  const highPriority = useMemo(() => {
    if (!stats) return 0
    return (stats.porPrioridade.ALTA ?? 0) + (stats.porPrioridade.URGENTE ?? 0)
  }, [stats])

  const activeFlow = useMemo(() => {
    if (!stats) return 0
    return stats.pendentes + stats.emAndamento
  }, [stats])

  const financialFlow = useMemo(() => stats?.porTipo.FINANCEIRO ?? 0, [stats])

  const completionRate = useMemo(() => {
    if (!stats?.totalAtividades) return 0
    return Math.round((stats.concluidas / stats.totalAtividades) * 100)
  }, [stats])

  const heroSignals = useMemo(() => {
    if (!stats) return []
    return [
      {
        label: 'Fluxo ativo',
        value: activeFlow,
        detail: `${stats.pendentes} pendentes e ${stats.emAndamento} em andamento`,
      },
      {
        label: 'Alta pressao',
        value: highPriority,
        detail: 'Alta + urgente pedindo decisao',
      },
      {
        label: 'Lembretes',
        value: stats.lembretesPendentes,
        detail: 'Automacoes prontas para disparar',
      },
    ]
  }, [activeFlow, highPriority, stats])

  const headlineCards = useMemo(() => {
    if (!stats) return []
    return [
      {
        label: 'Ritmo atual',
        value: activeFlow,
        detail: 'Volume em movimento no pipeline agora',
        kicker: 'Operacao',
        span: 'xl:col-span-4',
        icon: Activity,
        glow: 'from-primary/20 via-primary/6 to-transparent',
      },
      {
        label: 'Hoje',
        value: stats.hoje,
        detail: 'Itens com janela ativa no dia',
        kicker: 'Agenda',
        span: 'xl:col-span-2',
        icon: CalendarClock,
        glow: 'from-white/12 via-white/4 to-transparent',
      },
      {
        label: 'Alta prioridade',
        value: highPriority,
        detail: 'Carga que merece foco imediato',
        kicker: 'Pressao',
        span: 'xl:col-span-3',
        icon: AlertTriangle,
        glow: 'from-red-500/18 via-red-500/5 to-transparent',
      },
      {
        label: 'Financeiro',
        value: financialFlow,
        detail: 'Atividades ligadas a fluxo financeiro',
        kicker: 'Fluxo',
        span: 'xl:col-span-3',
        icon: Wallet,
        glow: 'from-emerald-500/18 via-emerald-500/5 to-transparent',
      },
    ]
  }, [activeFlow, financialFlow, highPriority, stats])

  const workflowRows = useMemo(() => {
    if (!stats) return []
    const total = Math.max(stats.totalAtividades, 1)
    return [
      {
        label: 'Pendentes',
        value: stats.pendentes,
        percent: (stats.pendentes / total) * 100,
        color: '#E29B45',
      },
      {
        label: 'Em andamento',
        value: stats.emAndamento,
        percent: (stats.emAndamento / total) * 100,
        color: '#9BD1FF',
      },
      {
        label: 'Concluidas',
        value: stats.concluidas,
        percent: (stats.concluidas / total) * 100,
        color: '#98D8A0',
      },
      {
        label: 'Atrasadas',
        value: stats.atrasadas,
        percent: (stats.atrasadas / total) * 100,
        color: '#F08377',
      },
    ]
  }, [stats])

  const tipoChartData = useMemo(() => {
    if (!stats) return { labels: [], data: [], colors: [] }
    return {
      labels: Object.keys(stats.porTipo).map(k => TIPO_LABEL[k as TipoAtividade] || k),
      data: Object.values(stats.porTipo),
      colors: ['#E29B45', '#F3C78E', '#8FB2A1'],
    }
  }, [stats])

  const prioridadeChartData = useMemo(() => {
    if (!stats) return { labels: [], data: [], colors: [] }
    return {
      labels: Object.keys(stats.porPrioridade).map(
        k => PRIORIDADE_LABEL[k as Prioridade] || k
      ),
      data: Object.values(stats.porPrioridade),
      colors: ['#98D8A0', '#F3C78E', '#E29B45', '#F08377'],
    }
  }, [stats])

  const hasPriorityData = useMemo(
    () => prioridadeChartData.data.some(value => value > 0),
    [prioridadeChartData]
  )

  const hasTypeData = useMemo(() => tipoChartData.data.some(value => value > 0), [tipoChartData])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <section className="glass-card-strong relative overflow-hidden px-6 py-7 md:px-8 md:py-9 xl:px-10">
        <div className="pointer-events-none absolute inset-y-0 right-[-10%] top-10 hidden w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(226,155,69,0.18),transparent_62%)] blur-3xl xl:block" />

        <div className="relative grid gap-8 xl:grid-cols-[1.45fr_0.92fr]">
          <div className="space-y-8">
            <div>
              <p className="section-kicker mb-4">Painel executivo</p>
              <h1 className="display-title max-w-[11ch] text-5xl text-[var(--text-primary)] sm:text-6xl xl:text-7xl">
                Controle que cria ritmo.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                Uma leitura rapida das frentes que puxam atencao, do que esta fluindo e dos
                proximos movimentos do seu dia.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {heroSignals.map(signal => (
                <div
                  key={signal.label}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="section-kicker mb-3">{signal.label}</p>
                  <p className="font-display text-4xl tracking-[-0.08em] text-[var(--text-primary)]">
                    {signal.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {signal.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 md:p-7">
            <div className="section-kicker mb-4">Leitura do dia</div>

            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Taxa de conclusao</p>
                <p className="font-display text-6xl tracking-[-0.08em] text-[var(--text-primary)]">
                  {completionRate}%
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">
                  Hoje
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  {stats?.hoje ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  label: 'Atrasadas',
                  value: stats?.atrasadas ?? 0,
                  note:
                    (stats?.atrasadas ?? 0) > 0
                      ? 'Pedem intervencao imediata'
                      : 'Sem gargalo critico',
                },
                {
                  label: 'Concluidas',
                  value: stats?.concluidas ?? 0,
                  note: 'Atividades finalizadas no acumulado',
                },
                {
                  label: 'Lembretes',
                  value: stats?.lembretesPendentes ?? 0,
                  note: 'Avisos automáticos em observacao',
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {item.note}
                    </p>
                  </div>
                  <p className="font-display text-3xl tracking-[-0.08em] text-[var(--text-primary)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/atividades/nova"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-[#171310] transition-transform hover:-translate-y-0.5"
              >
                Abrir nova atividade
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/atividades"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Ver pipeline
              </Link>
            </div>
          </div>
        </div>
      </section>

      <motion.div {...staggerContainer} className="grid gap-5 xl:grid-cols-12">
        {headlineCards.map(card => {
          const Icon = card.icon
          return (
            <motion.div key={card.label} {...staggerItem} className={card.span}>
              <Card glow className="relative overflow-hidden p-6 md:p-7">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow}`} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.05]">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {card.kicker}
                    </span>
                  </div>
                  <p className="mt-10 text-5xl font-semibold tracking-[-0.06em] text-[var(--text-primary)]">
                    {card.value}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{card.label}</p>
                  <p className="mt-2 max-w-[26ch] text-sm leading-6 text-[var(--text-secondary)]">
                    {card.detail}
                  </p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Card className="xl:col-span-7 p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker mb-2">Leitura principal</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                Mapa de prioridades
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                Onde a sua carga esta concentrada e qual frente exige atencao agora.
              </p>
            </div>
            <Link
              href="/atividades"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-light"
            >
              Abrir atividades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {hasPriorityData ? (
            <div className="h-80">
              <BarChart {...prioridadeChartData} />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  O painel ainda esta ganhando densidade.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Crie atividades com prioridades diferentes para acender uma leitura real do
                  volume.
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="xl:col-span-5 p-7">
          <p className="section-kicker mb-2">Ritmo operacional</p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Pipeline em foco</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Distribuicao do trabalho para leitura rapida sem precisar abrir listas.
          </p>

          <div className="mt-8 space-y-5">
            {workflowRows.map(row => (
              <div key={row.label} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{row.label}</p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {Math.round(row.percent)}% do volume
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-[var(--text-primary)]">{row.value}</p>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <Card className="xl:col-span-7 p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker mb-2">Proximos movimentos</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                Atividades que merecem vista imediata
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              <Bell className="h-3.5 w-3.5 text-primary" />
              {stats?.proximasAtividades?.length ?? 0} no radar
            </div>
          </div>

          {stats?.proximasAtividades?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {stats.proximasAtividades.slice(0, 4).map(atv => (
                <Link
                  key={atv.id}
                  href={`/atividades/${atv.id}/editar`}
                  className="group rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge value={atv.tipo} label={TIPO_LABEL[atv.tipo]} />
                    <Badge value={atv.prioridade} label={PRIORIDADE_LABEL[atv.prioridade]} />
                  </div>

                  <p className="mt-5 text-lg font-semibold leading-7 text-[var(--text-primary)]">
                    {atv.titulo}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
                        Prazo
                      </p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        {prazoRelativo(atv.prazo)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  Ainda nao existem atividades em destaque.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Assim que voce alimentar o fluxo, este painel passa a sugerir o que olhar em
                  seguida.
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="xl:col-span-5 p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker mb-2">Composicao</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Por tipo</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                O mix entre escolar, financeiro e geral em uma leitura unica.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.05]">
              <Layers3 className="h-5 w-5 text-primary" />
            </div>
          </div>

          {hasTypeData ? (
            <div className="h-72">
              <DoughnutChart {...tipoChartData} />
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  O mix por tipo ainda esta vazio.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Distribua novas atividades entre tipos para criar uma visao mais rica.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker mb-2">Resumo final</p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
              O que este painel esta dizendo agora
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.05]">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: 'Tracao',
              body: `${completionRate}% do volume total ja foi encerrado. O foco agora e manter ritmo sem deixar pendencias acumularem.`,
            },
            {
              title: 'Risco',
              body:
                highPriority > 0
                  ? `${highPriority} itens de alta pressao estao no radar e puxam a atencao do time.`
                  : 'Nao ha carga critica pressionando o fluxo neste momento.',
            },
            {
              title: 'Proximo passo',
              body:
                (stats?.proximasAtividades?.length ?? 0) > 0
                  ? 'Use a lista de proximos movimentos para transformar o painel em acao concreta.'
                  : 'Abra novas atividades para transformar este painel em uma leitura mais decisiva.',
            },
          ].map(item => (
            <div
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {item.title}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{item.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
