import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AtividadeService } from '../../services/atividade.service';
import { NotaPanelComponent } from '../../components/nota-panel/nota-panel.component';
import {
  Atividade, TIPOS, STATUSES, PRIORIDADES,
  TIPO_LABEL, PRIORIDADE_LABEL, STATUS_LABEL
} from '../../models/atividade.model';

@Component({
  selector: 'app-atividade-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule, MatProgressSpinnerModule,
    MatDividerModule, NotaPanelComponent
  ],
  templateUrl: './atividade-form.component.html',
  styleUrl: './atividade-form.component.scss'
})
export class AtividadeFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  editando = false;
  atividadeId?: number;
  atividade?: Atividade;

  tipos       = TIPOS;
  statuses    = STATUSES;
  prioridades = PRIORIDADES;
  tipoLabel       = TIPO_LABEL;
  prioridadeLabel = PRIORIDADE_LABEL;
  statusLabel     = STATUS_LABEL;

  constructor(
    private fb: FormBuilder,
    private service: AtividadeService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.atividadeId = +id;
      this.carregarAtividade(+id);
    }
  }

  initForm() {
    this.form = this.fb.group({
      titulo:         ['', [Validators.required, Validators.minLength(2)]],
      descricao:      [''],
      tipo:           ['GERAL', Validators.required],
      categoria:      [''],
      materia:        [''],
      prioridade:     ['MEDIA', Validators.required],
      status:         ['PENDENTE', Validators.required],
      prazo:          [null],
      tempoEstimado:  [null],
      valor:          [null]
    });
  }

  carregarAtividade(id: number) {
    this.loading = true;
    this.service.buscarPorId(id).subscribe({
      next: a => {
        this.atividade = a;
        this.form.patchValue({
          ...a,
          prazo: a.prazo ? new Date(a.prazo) : null
        });
        this.loading = false;
      },
      error: () => {
        this.snack.open('Atividade nao encontrada.', 'OK', { duration: 3000 });
        this.router.navigate(['/atividades']);
      }
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const dados: Atividade = {
      ...this.form.value,
      prazo: this.form.value.prazo
        ? new Date(this.form.value.prazo).toISOString()
        : null
    };

    const obs = this.editando && this.atividadeId
      ? this.service.atualizar(this.atividadeId, dados)
      : this.service.criar(dados);

    obs.subscribe({
      next: a => {
        this.saving = false;
        this.snack.open(
          this.editando ? 'Atividade atualizada!' : 'Atividade criada!',
          'OK', { duration: 3000, panelClass: 'snack-success' }
        );
        if (!this.editando) {
          this.router.navigate(['/atividades', a.id, 'editar']);
        }
      },
      error: () => {
        this.saving = false;
        this.snack.open('Erro ao salvar.', 'OK', { duration: 3000, panelClass: 'snack-error' });
      }
    });
  }

  get tipoAtual(): string { return this.form.value.tipo; }
  get mostrarMateria(): boolean { return this.tipoAtual === 'ESCOLAR'; }
  get mostrarValor(): boolean    { return this.tipoAtual === 'FINANCEIRO'; }
}
