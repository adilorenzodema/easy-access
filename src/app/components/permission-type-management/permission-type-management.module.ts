import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionTypeManagementRoutingModule } from './permission-type-management-routing.module';
import { PermissionTypeComponent } from './permission-type.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    PermissionTypeComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    PermissionTypeManagementRoutingModule
  ]
})
export class PermissionTypeManagementModule { }
