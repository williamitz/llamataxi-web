import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEGURITY_ROUTES } from './segurity-layout.routes';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild( SEGURITY_ROUTES )
  ]
})
export class SegurityLayoutModule {}
