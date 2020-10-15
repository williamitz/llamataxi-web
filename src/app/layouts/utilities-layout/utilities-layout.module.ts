import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UTILITIES_ROUTES } from './utilities-layout.routes';
import { RestoreAccountComponent } from '../../pages/utilitiesPages/restore-account/restore-account.component';



@NgModule({
  declarations: [
    RestoreAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild( UTILITIES_ROUTES )
  ]
})
export class UtilitiesLayoutModule { }
