
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TokenGuard } from './guards/token.guard';
import { AuthGuard } from './guards/auth.guard';
import { AllowUrlGuard } from './guards/allow-url.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';


const APP_ROUTES: Routes = [
  { path: '',
    pathMatch: 'full',
    component: AuthLayoutComponent,
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
  },

  { path: 'admin',
    // pathMatch: 'full',
    canLoad: [TokenGuard, AuthGuard],
    data: {title: 'Dashboard'},
    component: AdminLayoutComponent,
    loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
  },

  {
    path: 'login',
    component: AuthLayoutComponent,
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
  },
  {
    path: 'notFound',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
