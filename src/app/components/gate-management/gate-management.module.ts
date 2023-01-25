import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GateManagementRoutingModule } from './gate-management.routing';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GateManagementComponent } from './gate-management.component';


@NgModule({
  declarations: [
    GateManagementComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    GateManagementRoutingModule
  ]
})
export class GateManagementModule { }
