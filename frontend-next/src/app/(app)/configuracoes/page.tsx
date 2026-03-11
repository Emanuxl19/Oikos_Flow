'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Send, Eye, EyeOff, Cpu, Bot } from 'lucide-react'
import { useConfig } from '@/hooks/use-config'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { PROVEDORES, MODELOS } from '@/lib/constants'
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations'
import { useToast } from '@/providers/toast-provider'

export default function ConfiguracoesPage() {
  const { config, setConfig, loading, getConfig, salvar, testarTelegram } = useConfig()
  const { addToast } = useToast()

  const [saving, setSaving] = useState(false)
  const [testando, setTestando] = useState(false)
  const [mostrarKey, setMostrarKey] = useState(false)

  useEffect(() => { getConfig() }, [getConfig])

  const modelos = MODELOS[config.aiProvider || 'none'] || []

  const handleSalvar = async () => {
    setSaving(true)
    try {
      await salvar(config)
      addToast('Configurações salvas!', 'success')
    } catch {
      addToast('Erro ao salvar configurações', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleTestarTelegram = async () => {
    setTestando(true)
    try {
      const res = await testarTelegram()
      if (res.sucesso) {
        addToast('Telegram funcionando!', 'success')
      } else {
        addToast(res.mensagem || 'Falha no teste', 'error')
      }
    } catch {
      addToast('Erro ao testar Telegram', 'error')
    } finally {
      setTestando(false)
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
    <motion.div {...pageTransition} className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configurações</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Personalize a aplicação</p>
        </div>
      </div>

      <motion.div {...staggerContainer} className="space-y-6">
        {/* AI Provider */}
        <motion.div {...staggerItem}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-indigo-400" />
              </div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Provedor de IA</h2>
            </div>

            <div className="space-y-4">
              <Select
                label="Provedor"
                value={config.aiProvider || 'none'}
                onChange={e => setConfig(prev => ({ ...prev, aiProvider: e.target.value, aiModel: '' }))}
                options={PROVEDORES}
              />

              {config.aiProvider && config.aiProvider !== 'none' && (
                <>
                  <Select
                    label="Modelo"
                    placeholder="Selecione o modelo"
                    value={config.aiModel || ''}
                    onChange={e => setConfig(prev => ({ ...prev, aiModel: e.target.value }))}
                    options={modelos.map(m => ({ value: m, label: m }))}
                  />

                  <div className="relative">
                    <Input
                      label="API Key"
                      type={mostrarKey ? 'text' : 'password'}
                      placeholder="Sua chave de API"
                      value={config.aiApiKey || ''}
                      onChange={e => setConfig(prev => ({ ...prev, aiApiKey: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarKey(!mostrarKey)}
                      className="absolute right-3 top-[38px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {mostrarKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {config.aiProvider === 'openai' && (
                    <Input
                      label="Base URL (opcional)"
                      placeholder="https://api.openai.com/v1"
                      value={config.aiBaseUrl || ''}
                      onChange={e => setConfig(prev => ({ ...prev, aiBaseUrl: e.target.value }))}
                    />
                  )}

                  {config.aiProvider === 'ollama' && (
                    <Input
                      label="Ollama URL"
                      placeholder="http://localhost:11434"
                      value={config.aiOllamaUrl || ''}
                      onChange={e => setConfig(prev => ({ ...prev, aiOllamaUrl: e.target.value }))}
                    />
                  )}
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Telegram */}
        <motion.div {...staggerItem}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Telegram</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-[var(--text-secondary)]">Lembretes via Telegram</label>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, lembretesTelegramAtivos: !prev.lembretesTelegramAtivos }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.lembretesTelegramAtivos ? 'bg-primary' : 'bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      config.lembretesTelegramAtivos ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                Quando ativado, lembretes serão enviados via bot do Telegram. Configure o bot na variável de ambiente do servidor.
              </p>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestarTelegram}
                disabled={testando}
              >
                <Send className="w-4 h-4" />
                {testando ? 'Enviando...' : 'Testar Telegram'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Save */}
        <motion.div {...staggerItem}>
          <Button onClick={handleSalvar} disabled={saving} size="lg" className="w-full">
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
