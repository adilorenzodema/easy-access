import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';
import { PermissionManagementComponent } from './permission-management.component';
import { AddEditPermissionInterportoComponent } from './add-edit-permission-interporto/add-edit-permission-interporto.component';

const routes: Routes = [
  { path: '', component: PermissionManagementComponent},
  { path: 'add-permission' , component: AddEditPermissionComponent},
  { path: 'edit-permission' , component: AddEditPermissionComponent},
  { path: 'add-permission-interporto' , component: AddEditPermissionInterportoComponent},
  { path: 'edit-permission-interporto' , component: AddEditPermissionInterportoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
