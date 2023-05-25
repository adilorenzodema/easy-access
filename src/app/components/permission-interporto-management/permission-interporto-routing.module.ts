import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPermissionInterportoComponent } from './add-edit-permission-interporto/add-edit-permission-interporto.component';
import { PermissionInterportoManagementComponent } from './permission-interporto-management.component';

const routes: Routes = [
  { path: '', component: PermissionInterportoManagementComponent},
  { path: 'add-permission-interporto' , component: AddEditPermissionInterportoComponent},
  { path: 'edit-permission-interporto' , component: AddEditPermissionInterportoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
