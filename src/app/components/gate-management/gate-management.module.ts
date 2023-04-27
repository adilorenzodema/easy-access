import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GateManagementRoutingModule } from './gate-management.routing';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GateManagementComponent } from './gate-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalFormGateComponent } from './modal-form-gate/modal-form-gate.component';
import { TitleGateComponent } from './title-gate/title-gate.component';
import { TranslateModule } from '@ngx-translate/core';
import { GateStatusComponent } from './gate-status/gate-status.component';
import { NgScrollbarModule } from 'ngx-scrollbar';


@NgModule({
  declarations: [
    GateManagementComponent,
    ModalFormGateComponent,
    TitleGateComponent,
    GateStatusComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibMaterialModule,
    LibPipesModule,
    FlexLayoutModule,
    GateManagementRoutingModule,
    TranslateModule,
    NgScrollbarModule
  ]
})
export class GateManagementModule { }
