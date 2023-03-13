import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EfcListManagementRoutingModule } from './efc-list-management-routing.module';
import { EfcListManagementComponent } from './efc-list-management.component';


@NgModule({
  declarations: [EfcListManagementComponent],
  imports: [
    CommonModule,
    EfcListManagementRoutingModule
  ]
})
export class EfcListManagementModule { }
