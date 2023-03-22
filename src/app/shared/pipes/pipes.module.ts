import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckSelectedPipe } from './check-selected.pipe';
import { HolidaysTouchedPipe } from './holidays-touched.pipe';



@NgModule({
  declarations: [CheckSelectedPipe, HolidaysTouchedPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    CheckSelectedPipe,
    HolidaysTouchedPipe
  ]
})
export class PipesModuleModule { }
