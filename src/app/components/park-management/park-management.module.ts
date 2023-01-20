import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParkManagementRoutingModule } from './park-management.routing';
import { ParkManagementComponent } from './park-management.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ParkManagementComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ParkManagementRoutingModule
  ]
})
export class ParkManagementModule { }
