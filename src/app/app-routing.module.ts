
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';


const APP_ROUTES: Routes = [
  { path: '',
    pathMatch: 'full',
    component: AuthLayoutComponent,
    loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
  },

  { path: 'admin',
    // pathMatch: 'full',
    data: {title: 'Dashboard'},
    component: AdminLayoutComponent,
    loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  },


];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
