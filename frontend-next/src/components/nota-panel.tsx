'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Bell, BellOff, Save, X } from 'lucide-react'
import { useNotas } from '@/hooks/use-notas'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { staggerContainer, staggerItem, slideInRight } from '@/lib/animations'
import type { Nota } from '@/lib/types'

interface NotaPanelProps {
  atividadeId: number
}

export function NotaPanel({ atividadeId }: NotaPanelProps) {
  const { notas, listarPorAtividade, criar, atualizar, deletar } = useNotas()
  const [novaNota, setNovaNota] = useState('')
  const [lembreteData, setLembreteData] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [editandoTexto, setEditandoTexto] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)

  useEffect(() => {
    if (atividadeId) listarPorAtividade(atividadeId)
  }, [atividadeId, listarPorAtividade])

  const handleCriar = async () => {
    if (!novaNota.trim()) return
    await criar(atividadeId, {
      conteudo: novaNota,
      lembreteAtivo: !!lembreteData,
      dataLembrete: lembreteData || undefined,
    })
    setNovaNota('')
    setLembreteData('')
    setMostrarForm(false)
  }

  const handleAtualizar = async (id: number) => {
    if (!editandoTexto.trim()) return
    await atualizar(id, { conteudo: editandoTexto })
    setEditandoId(null)
    setEditandoTexto('')
  }

  const toggleLembrete = async (nota: Nota) => {
    if (nota.id) {
      await atualizar(nota.id, { lembreteAtivo: !nota.lembreteAtivo })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Notas ({notas.length})
        </h3>
        <Button
          size="sm"
          variant={mostrarForm ? 'ghost' : 'primary'}
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {mostrarForm ? 'Cancelar' : 'Nova nota'}
        </Button>
      </div>

      <AnimatePresence>
        {mostrarForm && (
          <motion.div {...slideInRight} className="space-y-3">
            <Card className="p-4 space-y-3">
              <textarea
                value={novaNota}
                onChange={e => setNovaNota(e.target.value)}
                placeholder="Escreva sua nota..."
                className="w-full h-24 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none text-sm"
              />
              <Input
                type="datetime-local"
                label="Lembrete (opcional)"
                value={lembreteData}
                onChange={e => setLembreteData(e.target.value)}
              />
              <Button size="sm" onClick={handleCriar} disabled={!novaNota.trim()}>
                <Save className="w-4 h-4" /> Salvar
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div {...staggerContainer} className="space-y-2">
        <AnimatePresence>
          {notas.map(nota => (
            <motion.div key={nota.id} {...staggerItem} layout>
              <Card className="p-3">
                {editandoId === nota.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editandoTexto}
                      onChange={e => setEditandoTexto(e.target.value)}
                      className="w-full h-20 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] text-sm resize-none focus:outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAtualizar(nota.id!)}>Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditandoId(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex-1 text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                      onClick={() => { setEditandoId(nota.id!); setEditandoTexto(nota.conteudo) }}
                    >
                      <p>{nota.conteudo}</p>
                      {nota.dataLembrete && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Lembrete: {new Date(nota.dataLembrete).toLocaleString('pt-BR')}
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {nota.dataCriacao && new Date(nota.dataCriacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleLembrete(nota)}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                        title={nota.lembreteAtivo ? 'Desativar lembrete' : 'Ativar lembrete'}
                      >
                        {nota.lembreteAtivo ? (
                          <Bell className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <BellOff className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        )}
                      </button>
                      <button
                        onClick={() => nota.id && deletar(nota.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {notas.length === 0 && !mostrarForm && (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">
          Nenhuma nota adicionada
        </p>
      )}
    </div>
  )
}
