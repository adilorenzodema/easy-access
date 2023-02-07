import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckSelectedPipe } from './check-selected.pipe';



@NgModule({
  declarations: [CheckSelectedPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    CheckSelectedPipe
  ]
})
export class PipesModuleModule { }
