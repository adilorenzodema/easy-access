import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GateManagementComponent } from './gate-management.component';
import { GateStatusComponent } from './gate-status/gate-status.component';

const routes: Routes = [
  { path: '', component: GateManagementComponent },
  { path: 'gate-status', component: GateStatusComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GateManagementRoutingModule { }
