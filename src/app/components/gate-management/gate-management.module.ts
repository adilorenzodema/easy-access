import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GateManagementRoutingModule } from './gate-management.routing';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GateManagementComponent } from './gate-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalFormGateComponent } from './modal-form-gate/modal-form-gate.component';


@NgModule({
  declarations: [
    GateManagementComponent,
    ModalFormGateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibMaterialModule,
    FlexLayoutModule,
    GateManagementRoutingModule
  ]
})
export class GateManagementModule { }
