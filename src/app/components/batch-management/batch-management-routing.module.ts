import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchManagementComponent } from './batch-management.component';

const routes: Routes = [
  {path: '', component: BatchManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchManagementRoutingModule { }
