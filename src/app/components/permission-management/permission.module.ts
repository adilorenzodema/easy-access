import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibMaterialModule } from 'dema-movyon-template';
import { PermissionManagementComponent } from './permission-management.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';


@NgModule({
  declarations: [PermissionManagementComponent, AddEditPermissionComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    PermissionRoutingModule
  ]
})
export class PermissionModule { }
