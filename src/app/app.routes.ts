import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((module) => module.Home),
    title: 'Portfolio',
  },
  {
    path: 'legal-notice',
    loadComponent: () =>
      import('./pages/legal-notice/legal-notice').then((module) => module.LegalNotice),
    title: 'Legal notice | Portfolio',
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy').then((module) => module.PrivacyPolicy),
    title: 'Privacy policy | Portfolio',
  },
];
