import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { PermissionManagementComponent } from './permission-management.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { AddEditPermissionComponent } from './add-edit-permission/add-edit-permission.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [PermissionManagementComponent, AddEditPermissionComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    LibPipesModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    PermissionRoutingModule,
    NgxMaterialTimepickerModule
  ]
})
export class PermissionModule { }
