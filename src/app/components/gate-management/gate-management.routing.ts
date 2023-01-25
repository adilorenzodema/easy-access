import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GateManagementComponent } from './gate-management.component';

const routes: Routes = [
  {path: '', component: GateManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GateManagementRoutingModule { }
