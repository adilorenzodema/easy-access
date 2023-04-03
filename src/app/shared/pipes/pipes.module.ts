import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckSelectedPipe } from './check-selected.pipe';
import { HolidaysTouchedPipe } from './holidays-touched.pipe';
import { IconColorPipe } from './icon-color.pipe';



@NgModule({
  declarations: [CheckSelectedPipe, HolidaysTouchedPipe, IconColorPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    CheckSelectedPipe,
    HolidaysTouchedPipe,
    IconColorPipe
  ]
})
export class PipesModuleModule { }
