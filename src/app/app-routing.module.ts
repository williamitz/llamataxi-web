
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';


const APP_ROUTES: Routes = [
  { path: '',
    component: AuthLayoutComponent,
    loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
