'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useAtividades } from '@/hooks/use-atividades'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { TIPOS, PRIORIDADES, TIPO_LABEL, PRIORIDADE_LABEL } from '@/lib/constants'
import { pageTransition } from '@/lib/animations'
import { useToast } from '@/providers/toast-provider'
import type { TipoAtividade, Prioridade } from '@/lib/types'

export default function NovaAtividadePage() {
  const router = useRouter()
  const { criar } = useAtividades()
  const { addToast } = useToast()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'GERAL' as TipoAtividade,
    prioridade: 'MEDIA' as Prioridade,
    categoria: '',
    materia: '',
    prazo: '',
    tempoEstimado: '',
    valor: '',
  })

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) {
      addToast('Título é obrigatório', 'error')
      return
    }
    setSaving(true)
    try {
      await criar({
        titulo: form.titulo,
        descricao: form.descricao || undefined,
        tipo: form.tipo,
        prioridade: form.prioridade,
        categoria: form.categoria || undefined,
        materia: form.materia || undefined,
        prazo: form.prazo || undefined,
        tempoEstimado: form.tempoEstimado ? Number(form.tempoEstimado) : undefined,
        valor: form.valor ? Number(form.valor) : undefined,
        status: 'PENDENTE',
      })
      addToast('Atividade criada com sucesso!', 'success')
      router.push('/atividades')
    } catch {
      addToast('Erro ao criar atividade', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div {...pageTransition} className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/atividades">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Nova Atividade</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Preencha os dados abaixo</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Título *"
            placeholder="Nome da atividade"
            value={form.titulo}
            onChange={e => set('titulo', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Descrição
            </label>
            <textarea
              placeholder="Descreva a atividade..."
              value={form.descricao}
              onChange={e => set('descricao', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {form.tipo === 'ESCOLAR' && (
            <Input
              label="Matéria"
              placeholder="Ex: Matemática, Português..."
              value={form.materia}
              onChange={e => set('materia', e.target.value)}
            />
          )}

          <Input
            label="Categoria"
            placeholder="Ex: Trabalho, Estudo, Pessoal..."
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
              placeholder="60"
              value={form.tempoEstimado}
              onChange={e => set('tempoEstimado', e.target.value)}
            />
          </div>

          {form.tipo === 'FINANCEIRO' && (
            <Input
              type="number"
              label="Valor (R$)"
              placeholder="0.00"
              step="0.01"
              value={form.valor}
              onChange={e => set('valor', e.target.value)}
            />
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Criar Atividade'}
            </Button>
            <Link href="/atividades">
              <Button type="button" variant="ghost">Cancelar</Button>
            </Link>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
