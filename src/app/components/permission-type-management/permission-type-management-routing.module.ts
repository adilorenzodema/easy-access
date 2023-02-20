import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPermissionTypeComponent } from './add-edit-permission-type/add-edit-permission-type.component';
import { PermissionTypeComponent } from './permission-type.component';

const routes: Routes = [
  {path: '', component: PermissionTypeComponent},
  {path: 'add-permission-type', component: AddEditPermissionTypeComponent},
  {path: 'edit-permission-type', component: AddEditPermissionTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionTypeManagementRoutingModule { }
