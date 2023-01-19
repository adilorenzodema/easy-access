import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { AreaManagementRoutingModule } from './area-management.routing';
import { AreaManagementComponent } from './area-management.component';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area/modal-form-area.component';

@NgModule({
  declarations: [
    AreaManagementComponent,
    ModalFormAreaComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AreaManagementRoutingModule
  ]
})
export class AreaManagementModule { }
