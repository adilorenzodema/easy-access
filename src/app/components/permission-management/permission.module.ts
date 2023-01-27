import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionManagementComponent } from './permission-management.component';


@NgModule({
  declarations: [PermissionManagementComponent],
  imports: [
    CommonModule,
    PermissionRoutingModule
  ]
})
export class PermissionModule { }
