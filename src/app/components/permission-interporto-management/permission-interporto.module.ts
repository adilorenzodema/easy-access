import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { PermissionRoutingModule } from './permission-interporto-routing.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PipesModuleModule } from "../../shared/pipes/pipes.module";
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AddEditPermissionInterportoComponent } from './add-edit-permission-interporto/add-edit-permission-interporto.component';
import { PermissionInterportoManagementComponent } from './permission-interporto-management.component';

@NgModule({
  declarations: [PermissionInterportoManagementComponent, AddEditPermissionInterportoComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    LibPipesModule,
    FlexLayoutModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PermissionRoutingModule,
    NgxMaterialTimepickerModule,
    PipesModuleModule,
    NgScrollbarModule
  ]
})
export class PermissionInterportoModule { }
