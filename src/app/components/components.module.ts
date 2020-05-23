import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent
  ]
})
export class ComponentsModule { }
