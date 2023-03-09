import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidaysComponentComponent } from './holidays-component.component';

const routes: Routes = [
  { path: '', component: HolidaysComponentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidaysComponentRoutingModule { }
