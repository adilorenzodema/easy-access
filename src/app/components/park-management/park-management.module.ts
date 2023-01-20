import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParkManagementRoutingModule } from './park-management.routing';
import { ParkManagementComponent } from './park-management.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    ParkManagementComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    ParkManagementRoutingModule
  ]
})
export class ParkManagementModule { }
