import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowIndexPipe } from './row-index.pipe';
import { YesnoPipe } from './yesno.pipe';
import { RolesPipe } from './roles.pipe';
import { ColorPipe } from './color.pipe';
import { MomentPipe } from './moment.pipe';
import { ReplacePipe } from './replace.pipe';
import { SexPipe } from './sex.pipe';
import { UserUrlPipe } from './user-url.pipe';

@NgModule({
  declarations: [
    RowIndexPipe,
    YesnoPipe,
    RolesPipe,
    ColorPipe,
    MomentPipe,
    ReplacePipe,
    SexPipe,
    UserUrlPipe
  ],
  exports: [
    RowIndexPipe,
    YesnoPipe,
    RolesPipe,
    ColorPipe,
    MomentPipe,
    ReplacePipe,
    SexPipe,
    UserUrlPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
