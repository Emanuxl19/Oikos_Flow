import { Nota } from './nota.model';

export type TipoAtividade = 'ESCOLAR' | 'FINANCEIRO' | 'GERAL';
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type StatusAtividade = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';

export interface Atividade {
  id?: number;
  titulo: string;
  descricao?: string;
  tipo: TipoAtividade;
  categoria?: string;
  materia?: string;
  prioridade: Prioridade;
  status: StatusAtividade;
  prazo?: string;
  tempoEstimado?: number;
  valor?: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
  notas?: Nota[];
}

export const TIPOS: TipoAtividade[]       = ['ESCOLAR', 'FINANCEIRO', 'GERAL'];
export const PRIORIDADES: Prioridade[]    = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];
export const STATUSES: StatusAtividade[]  = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'];

export const TIPO_LABEL: Record<TipoAtividade, string> = {
  ESCOLAR: 'Escolar',
  FINANCEIRO: 'Financeiro',
  GERAL: 'Geral'
};

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Media',
  ALTA: 'Alta',
  URGENTE: 'Urgente'
};

export const STATUS_LABEL: Record<StatusAtividade, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluida',
  CANCELADA: 'Cancelada'
};
