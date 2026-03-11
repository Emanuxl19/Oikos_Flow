'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useAtividades } from '@/hooks/use-atividades'
import { NotaPanel } from '@/components/nota-panel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { TIPOS, PRIORIDADES, STATUSES, TIPO_LABEL, PRIORIDADE_LABEL, STATUS_LABEL } from '@/lib/constants'
import { pageTransition } from '@/lib/animations'
import { useToast } from '@/providers/toast-provider'
import type { TipoAtividade, Prioridade, StatusAtividade } from '@/lib/types'

export default function EditarAtividadePage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const { buscarPorId, atualizar, concluir, deletar } = useAtividades()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'GERAL' as TipoAtividade,
    prioridade: 'MEDIA' as Prioridade,
    status: 'PENDENTE' as StatusAtividade,
    categoria: '',
    materia: '',
    prazo: '',
    tempoEstimado: '',
    valor: '',
  })

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const atv = await buscarPorId(id)
        setForm({
          titulo: atv.titulo || '',
          descricao: atv.descricao || '',
          tipo: atv.tipo,
          prioridade: atv.prioridade,
          status: atv.status,
          categoria: atv.categoria || '',
          materia: atv.materia || '',
          prazo: atv.prazo ? atv.prazo.slice(0, 16) : '',
          tempoEstimado: atv.tempoEstimado?.toString() || '',
          valor: atv.valor?.toString() || '',
        })
      } catch {
        addToast('Atividade não encontrada', 'error')
        router.push('/atividades')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, buscarPorId, addToast, router])

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) {
      addToast('Título é obrigatório', 'error')
      return
    }
    setSaving(true)
    try {
      await atualizar(id, {
        titulo: form.titulo,
        descricao: form.descricao || undefined,
        tipo: form.tipo,
        prioridade: form.prioridade,
        status: form.status,
        categoria: form.categoria || undefined,
        materia: form.materia || undefined,
        prazo: form.prazo || undefined,
        tempoEstimado: form.tempoEstimado ? Number(form.tempoEstimado) : undefined,
        valor: form.valor ? Number(form.valor) : undefined,
      })
      addToast('Atividade atualizada!', 'success')
    } catch {
      addToast('Erro ao salvar', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleConcluir = async () => {
    try {
      await concluir(id)
      setForm(prev => ({ ...prev, status: 'CONCLUIDA' }))
      addToast('Atividade concluída!', 'success')
    } catch {
      addToast('Erro ao concluir', 'error')
    }
  }

  const handleDeletar = async () => {
    try {
      await deletar(id)
      addToast('Atividade removida', 'success')
      router.push('/atividades')
    } catch {
      addToast('Erro ao remover', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/atividades">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Editar Atividade</h1>
              <Badge value={form.status} label={STATUS_LABEL[form.status]} />
            </div>
            <p className="text-sm text-[var(--text-muted)]">ID #{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {form.status !== 'CONCLUIDA' && (
            <Button variant="secondary" size="sm" onClick={handleConcluir}>
              <CheckCircle2 className="w-4 h-4" /> Concluir
            </Button>
          )}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <Button variant="danger" size="sm" onClick={handleDeletar}>Confirmar</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
            </div>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Título *"
                value={form.titulo}
                onChange={e => set('titulo', e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={e => set('descricao', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Tipo"
                  value={form.tipo}
                  onChange={e => set('tipo', e.target.value)}
                  options={TIPOS.map(t => ({ value: t, label: TIPO_LABEL[t] }))}
                />
                <Select
                  label="Prioridade"
                  value={form.prioridade}
                  onChange={e => set('prioridade', e.target.value)}
                  options={PRIORIDADES.map(p => ({ value: p, label: PRIORIDADE_LABEL[p] }))}
                />
                <Select
                  label="Status"
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  options={STATUSES.map(s => ({ value: s, label: STATUS_LABEL[s] }))}
                />
              </div>

              {form.tipo === 'ESCOLAR' && (
                <Input
                  label="Matéria"
                  value={form.materia}
                  onChange={e => set('materia', e.target.value)}
                />
              )}

              <Input
                label="Categoria"
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  label="Prazo"
                  value={form.prazo}
                  onChange={e => set('prazo', e.target.value)}
                />
                <Input
                  type="number"
                  label="Tempo estimado (min)"
                  value={form.tempoEstimado}
                  onChange={e => set('tempoEstimado', e.target.value)}
                />
              </div>

              {form.tipo === 'FINANCEIRO' && (
                <Input
                  type="number"
                  label="Valor (R$)"
                  step="0.01"
                  value={form.valor}
                  onChange={e => set('valor', e.target.value)}
                />
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Link href="/atividades">
                  <Button type="button" variant="ghost">Voltar</Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>

        {/* Notas Panel */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <NotaPanel atividadeId={id} />
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
