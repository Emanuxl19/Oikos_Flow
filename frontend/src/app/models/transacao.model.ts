export type TipoTransacao = 'RECEITA' | 'DESPESA';

export interface Transacao {
  id?: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria?: string;
  data: string;
  observacao?: string;
}

export interface ResumoFinanceiro {
  receitas: number;
  despesas: number;
  saldo: number;
  despesasPorCategoria: Record<string, number>;
}

export const CATEGORIAS_DESPESA = [
  'Alimentacao', 'Transporte', 'Moradia', 'Saude', 'Educacao',
  'Lazer', 'Roupas', 'Servicos', 'Outros'
];

export const CATEGORIAS_RECEITA = [
  'Salario', 'Freelance', 'Investimentos', 'Aluguel', 'Bonus', 'Outros'
];
