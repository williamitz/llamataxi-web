import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SEGURITY_ROUTES } from './segurity-layout.routes';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { MonitorServiceComponent } from 'src/app/pages/segurityPages/monitor-service/monitor-service.component';

@NgModule({
  declarations: [
    MonitorServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    RouterModule.forChild( SEGURITY_ROUTES )
  ]
})
export class SegurityLayoutModule {}
