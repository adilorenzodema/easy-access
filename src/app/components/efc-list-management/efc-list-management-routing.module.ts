import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EfcListManagementComponent } from './efc-list-management.component';

const routes: Routes = [
  { path: '', component: EfcListManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EfcListManagementRoutingModule { }
