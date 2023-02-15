import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionTypeManagementRoutingModule } from './permission-type-management-routing.module';
import { PermissionTypeComponent } from './permission-type.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditPermissionTypeComponent } from './add-edit-permission-type/add-edit-permission-type.component';


@NgModule({
  declarations: [
    PermissionTypeComponent,
    AddEditPermissionTypeComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule,
    PermissionTypeManagementRoutingModule
  ]
})
export class PermissionTypeManagementModule { }
