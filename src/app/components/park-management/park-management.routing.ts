import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditParkComponent } from './edit-park/edit-park.component';
import { ParkManagementComponent } from './park-management.component';

const routes: Routes = [
  { path: '', component: ParkManagementComponent },
  { path: 'edit-park', component: EditParkComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkManagementRoutingModule { }
