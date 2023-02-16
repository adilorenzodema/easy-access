import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GateManagementRoutingModule } from './gate-management.routing';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GateManagementComponent } from './gate-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalFormGateComponent } from './modal-form-gate/modal-form-gate.component';
import { TitleGateComponent } from './title-gate/title-gate.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    GateManagementComponent,
    ModalFormGateComponent,
    TitleGateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibMaterialModule,
    FlexLayoutModule,
    GateManagementRoutingModule,
    TranslateModule
  ]
})
export class GateManagementModule { }
