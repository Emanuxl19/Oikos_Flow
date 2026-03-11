import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard.model';
import { PRIORIDADE_LABEL, TIPO_LABEL, STATUS_LABEL } from '../../models/atividade.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tipoChart')      tipoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('prioridadeChart') prioridadeChartRef!: ElementRef<HTMLCanvasElement>;

  quickQuery = '';
  citySuggestions = ['Centro', 'Vieiralves', 'Adrianopolis', 'Ponta Negra'];
  filterOptions = ['Wi-Fi rapido', 'Salas privadas', '24h', 'Cafe incluso', 'Estacionamento', 'Pet friendly'];
  activeFilters = new Set<string>();

  stats?: DashboardStats;
  loading = true;
  tipoChart?: Chart;
  prioridadeChart?: Chart;

  prioridadeLabel = PRIORIDADE_LABEL;
  tipoLabel       = TIPO_LABEL;
  statusLabel     = STATUS_LABEL;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.carregarStats();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.tipoChart?.destroy();
    this.prioridadeChart?.destroy();
  }

  carregarStats() {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: stats => {
        this.stats = stats;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 100);
      },
      error: () => { this.loading = false; }
    });
  }

  renderCharts() {
    if (!this.stats) return;
    if (!this.tipoChartRef || !this.prioridadeChartRef) return;

    // Destroi charts anteriores
    this.tipoChart?.destroy();
    this.prioridadeChart?.destroy();

    const tipoColors = ['#6366f1', '#22d3ee', '#10b981'];
    const prioridadeColors = ['#ef4444', '#f97316', '#38bdf8', '#a3e635'];

    this.tipoChart = new Chart(this.tipoChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.stats.porTipo).map(k => this.tipoLabel[k as keyof typeof this.tipoLabel] || k),
        datasets: [{ data: Object.values(this.stats.porTipo), backgroundColor: tipoColors, borderWidth: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              usePointStyle: true
            }
          }
        }
      }
    });

    this.prioridadeChart = new Chart(this.prioridadeChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(this.stats.porPrioridade).map(k => this.prioridadeLabel[k as keyof typeof this.prioridadeLabel] || k),
        datasets: [{
          label: 'Atividades',
          data: Object.values(this.stats.porPrioridade),
          backgroundColor: prioridadeColors,
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: '#cbd5e1' },
            grid: { color: 'rgba(148, 163, 184, 0.12)' }
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#cbd5e1' },
            grid: { color: 'rgba(148, 163, 184, 0.12)' }
          }
        }
      }
    });
  }

  toggleFilter(filter: string) {
    if (this.activeFilters.has(filter)) {
      this.activeFilters.delete(filter);
      return;
    }
    this.activeFilters.add(filter);
  }

  applySuggestion(city: string) {
    this.quickQuery = city;
  }

  get statCards() {
    if (!this.stats) return [];
    return [
      { label: 'Revenue Today', value: this.stats.totalAtividades, icon: 'trending_up', delta: '+12%' },
      { label: 'Pendentes', value: this.stats.pendentes, icon: 'pending_actions', delta: `${this.stats.hoje} hoje` },
      { label: 'Em andamento', value: this.stats.emAndamento, icon: 'autorenew', delta: 'Em fluxo' },
      { label: 'Concluidas', value: this.stats.concluidas, icon: 'task_alt', delta: 'Meta ativa' },
      { label: 'Atrasadas', value: this.stats.atrasadas, icon: 'warning_amber', delta: 'Priorizar' },
      { label: 'Lembretes', value: this.stats.lembretesPendentes, icon: 'notifications_active', delta: 'Automacao' }
    ];
  }

  get workflowRows() {
    if (!this.stats) return [];
    const total = Math.max(this.stats.totalAtividades, 1);
    return [
      { label: 'Pendentes', value: this.stats.pendentes, percent: (this.stats.pendentes / total) * 100, color: '#f59e0b' },
      { label: 'Em andamento', value: this.stats.emAndamento, percent: (this.stats.emAndamento / total) * 100, color: '#38bdf8' },
      { label: 'Concluidas', value: this.stats.concluidas, percent: (this.stats.concluidas / total) * 100, color: '#10b981' },
      { label: 'Atrasadas', value: this.stats.atrasadas, percent: (this.stats.atrasadas / total) * 100, color: '#ef4444' }
    ];
  }

  prazoRelativo(prazo?: string): string {
    if (!prazo) return '';
    const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000);
    if (diff < 0)  return `${Math.abs(diff)}d atrasada`;
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanha';
    return `em ${diff} dias`;
  }
}
