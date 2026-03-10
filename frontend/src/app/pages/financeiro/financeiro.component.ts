import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransacaoService } from '../../services/transacao.service';
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA, ResumoFinanceiro, Transacao } from '../../models/transacao.model';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatDatepickerModule, MatNativeDateModule, MatTooltipModule
  ],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent implements OnInit {
  transacoes: Transacao[] = [];
  resumo: ResumoFinanceiro = { receitas: 0, despesas: 0, saldo: 0, despesasPorCategoria: {} };
  loading = false;
  salvando = false;
  mostrarForm = false;
  editando: Transacao | null = null;

  anoAtual = new Date().getFullYear();
  mesAtual = new Date().getMonth() + 1;
  anos = Array.from({ length: 3 }, (_, i) => this.anoAtual - i);
  meses = [
    { v: 1, l: 'Janeiro' }, { v: 2, l: 'Fevereiro' }, { v: 3, l: 'Marco' },
    { v: 4, l: 'Abril' }, { v: 5, l: 'Maio' }, { v: 6, l: 'Junho' },
    { v: 7, l: 'Julho' }, { v: 8, l: 'Agosto' }, { v: 9, l: 'Setembro' },
    { v: 10, l: 'Outubro' }, { v: 11, l: 'Novembro' }, { v: 12, l: 'Dezembro' }
  ];

  form: Partial<Transacao> = this.emptyForm();
  categoriasOpcoes: string[] = [];

  readonly CATEGORIAS_DESPESA = CATEGORIAS_DESPESA;
  readonly CATEGORIAS_RECEITA = CATEGORIAS_RECEITA;

  constructor(private transacaoService: TransacaoService, private snack: MatSnackBar) {}

  ngOnInit() { this.carregar(); }

  emptyForm(): Partial<Transacao> {
    return { descricao: '', valor: 0, tipo: 'DESPESA', categoria: '', data: new Date().toISOString().split('T')[0], observacao: '' };
  }

  carregar() {
    this.loading = true;
    this.transacaoService.listarMes(this.anoAtual, this.mesAtual).subscribe({
      next: t => { this.transacoes = t; this.loading = false; },
      error: () => this.loading = false
    });
    this.transacaoService.resumo(this.anoAtual, this.mesAtual).subscribe({
      next: r => this.resumo = r
    });
  }

  onTipoChange() {
    this.categoriasOpcoes = this.form.tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
    this.form.categoria = '';
  }

  abrirForm(t?: Transacao) {
    if (t) {
      this.editando = t;
      this.form = { ...t };
    } else {
      this.editando = null;
      this.form = this.emptyForm();
    }
    this.categoriasOpcoes = this.form.tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
    this.mostrarForm = true;
  }

  fecharForm() {
    this.mostrarForm = false;
    this.editando = null;
    this.form = this.emptyForm();
  }

  salvar() {
    if (!this.form.descricao || !this.form.valor || !this.form.tipo || !this.form.data) return;
    this.salvando = true;
    const obs = this.editando?.id
      ? this.transacaoService.atualizar(this.editando.id, this.form as Transacao)
      : this.transacaoService.criar(this.form as Transacao);
    obs.subscribe({
      next: () => {
        this.salvando = false;
        this.fecharForm();
        this.carregar();
        this.snack.open('Salvo!', '', { duration: 2000, panelClass: 'snack-success' });
      },
      error: () => { this.salvando = false; }
    });
  }

  deletar(t: Transacao) {
    if (!confirm(`Excluir "${t.descricao}"?`)) return;
    this.transacaoService.deletar(t.id!).subscribe({
      next: () => { this.carregar(); this.snack.open('Removido.', '', { duration: 2000 }); }
    });
  }

  get categoriaEntradas(): { nome: string; valor: number }[] {
    return Object.entries(this.resumo.despesasPorCategoria)
      .map(([nome, valor]) => ({ nome, valor }));
  }

  porcentagem(valor: number): number {
    return this.resumo.despesas > 0 ? Math.round((valor / this.resumo.despesas) * 100) : 0;
  }
}
