import { TipoAtividade, Prioridade, StatusAtividade } from './types'

export const TIPOS: TipoAtividade[] = ['ESCOLAR', 'FINANCEIRO', 'GERAL']
export const PRIORIDADES: Prioridade[] = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']
export const STATUSES: StatusAtividade[] = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']

export const TIPO_LABEL: Record<TipoAtividade, string> = {
  ESCOLAR: 'Escolar',
  FINANCEIRO: 'Financeiro',
  GERAL: 'Geral',
}

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
}

export const STATUS_LABEL: Record<StatusAtividade, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
}

export const CATEGORIAS_DESPESA = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação',
  'Lazer', 'Roupas', 'Serviços', 'Outros',
]

export const CATEGORIAS_RECEITA = [
  'Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Bônus', 'Outros',
]

export const PROVEDORES = [
  { value: 'none', label: 'Nenhum' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'openai', label: 'OpenAI / DeepSeek / Qwen / Kimi' },
  { value: 'gemini', label: 'Gemini (Google)' },
  { value: 'ollama', label: 'Ollama (Local)' },
]

export const MODELOS: Record<string, string[]> = {
  claude: ['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001', 'claude-opus-4-20250514'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'deepseek-chat', 'qwen-plus'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  ollama: ['llama3', 'mistral', 'codellama', 'phi3'],
  none: [],
}
