import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { LibMaterialModule } from 'dema-movyon-template';
import { PermissionManagementComponent } from './permission-management.component';
import { PermissionRoutingModule } from './permission-routing.module';


@NgModule({
  declarations: [PermissionManagementComponent],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    PermissionRoutingModule
  ]
})
export class PermissionModule { }
