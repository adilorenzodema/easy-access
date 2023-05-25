import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';
import { PermissionManagementComponent } from './permission-management.component';
const routes: Routes = [
  { path: '', component: PermissionManagementComponent},
  { path: 'add-permission' , component: AddEditPermissionComponent},
  { path: 'edit-permission' , component: AddEditPermissionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
