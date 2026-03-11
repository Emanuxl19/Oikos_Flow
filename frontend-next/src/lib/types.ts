// Nota
export interface Nota {
  id?: number
  conteudo: string
  dataLembrete?: string
  lembreteAtivo: boolean
  lembreteEnviado?: boolean
  dataCriacao?: string
  atividadeId?: number
  atividadeTitulo?: string
}

// Atividade
export type TipoAtividade = 'ESCOLAR' | 'FINANCEIRO' | 'GERAL'
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
export type StatusAtividade = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'

export interface Atividade {
  id?: number
  titulo: string
  descricao?: string
  tipo: TipoAtividade
  categoria?: string
  materia?: string
  prioridade: Prioridade
  status: StatusAtividade
  prazo?: string
  tempoEstimado?: number
  valor?: number
  dataCriacao?: string
  dataAtualizacao?: string
  notas?: Nota[]
}

// Dashboard
export interface DashboardStats {
  totalAtividades: number
  pendentes: number
  emAndamento: number
  concluidas: number
  atrasadas: number
  hoje: number
  lembretesPendentes: number
  porTipo: Record<string, number>
  porPrioridade: Record<string, number>
  proximasAtividades: Atividade[]
}

// Transacao
export type TipoTransacao = 'RECEITA' | 'DESPESA'

export interface Transacao {
  id?: number
  descricao: string
  valor: number
  tipo: TipoTransacao
  categoria?: string
  data: string
  observacao?: string
}

export interface ResumoFinanceiro {
  receitas: number
  despesas: number
  saldo: number
  despesasPorCategoria: Record<string, number>
}

// Auth
export interface AuthResponse {
  token: string
  nome: string
  email: string
}

export interface UserInfo {
  nome: string
  email: string
}

// Config
export interface Configuracao {
  id?: number
  aiProvider?: string
  aiApiKey?: string
  aiModel?: string
  aiBaseUrl?: string
  aiOllamaUrl?: string
  lembretesTelegramAtivos?: boolean
}
