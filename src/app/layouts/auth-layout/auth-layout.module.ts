import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AUTH_ROUTES } from './auth-Layout.routes';
import { LoginComponent } from '../../pages/authPages/login/login.component';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AUTH_ROUTES)
  ]
})
export class AuthLayoutModule { }
