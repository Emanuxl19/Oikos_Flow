import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
import { Atividade, PRIORIDADE_LABEL, TIPO_LABEL, STATUS_LABEL } from '../../models/atividade.model';

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
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('tipoChart')      tipoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('prioridadeChart') prioridadeChartRef!: ElementRef<HTMLCanvasElement>;

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

    // Destroi charts anteriores
    this.tipoChart?.destroy();
    this.prioridadeChart?.destroy();

    const tipoColors = ['#7c4dff', '#00bcd4', '#66bb6a'];
    const prioridadeColors = ['#ef5350', '#ff7043', '#42a5f5', '#9ccc65'];

    this.tipoChart = new Chart(this.tipoChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.stats.porTipo).map(k => this.tipoLabel[k as keyof typeof this.tipoLabel] || k),
        datasets: [{ data: Object.values(this.stats.porTipo), backgroundColor: tipoColors, borderWidth: 0 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
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
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
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
