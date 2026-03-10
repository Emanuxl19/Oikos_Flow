import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'atividades',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/atividades/atividades.component').then(m => m.AtividadesComponent)
  },
  {
    path: 'atividades/nova',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/atividade-form/atividade-form.component').then(m => m.AtividadeFormComponent)
  },
  {
    path: 'atividades/:id/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/atividade-form/atividade-form.component').then(m => m.AtividadeFormComponent)
  },
  {
    path: 'financeiro',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/financeiro/financeiro.component').then(m => m.FinanceiroComponent)
  },
  {
    path: 'configuracoes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent)
  },
  { path: '**', redirectTo: 'login' }
];
