import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowIndexPipe } from './row-index.pipe';

@NgModule({
  declarations: [
    RowIndexPipe
  ],
  exports: [
    RowIndexPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
