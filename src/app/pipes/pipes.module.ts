import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowIndexPipe } from './row-index.pipe';
import { YesnoPipe } from './yesno.pipe';
import { RolesPipe } from './roles.pipe';

@NgModule({
  declarations: [
    RowIndexPipe,
    YesnoPipe,
    RolesPipe
  ],
  exports: [
    RowIndexPipe,
    YesnoPipe,
    RolesPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
