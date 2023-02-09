import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaManagementComponent } from './area-management.component';
import { EditAreaComponent } from './edit-area/edit-area.component';

const routes: Routes = [
  { path: '', component: AreaManagementComponent },
  { path: 'edit-area', component: EditAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaManagementRoutingModule { }
