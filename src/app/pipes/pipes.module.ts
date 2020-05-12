import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowIndexPipe } from './row-index.pipe';
import { YesnoPipe } from './yesno.pipe';
import { RolesPipe } from './roles.pipe';
import { ColorPipe } from './color.pipe';

@NgModule({
  declarations: [
    RowIndexPipe,
    YesnoPipe,
    RolesPipe,
    ColorPipe
  ],
  exports: [
    RowIndexPipe,
    YesnoPipe,
    RolesPipe,
    ColorPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
