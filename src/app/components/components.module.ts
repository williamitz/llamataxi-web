import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SidebarComponent,
    FooterComponent
  ]
})
export class ComponentsModule { }
