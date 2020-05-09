import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AUTH_ROUTES } from './auth-Layout.routes';
import { LoginComponent } from '../../pages/authPages/login/login.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AUTH_ROUTES)
  ]
})
export class AuthLayoutModule { }
