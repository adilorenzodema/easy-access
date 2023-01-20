import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkManagementComponent } from './park-management.component';

const routes: Routes = [
  {path: '', component: ParkManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkManagementRoutingModule { }
