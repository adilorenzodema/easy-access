import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransitManagementRoutingModule } from './transit-management-routing.module';
import { TransitComponent } from './transit.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    TransitComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    TransitManagementRoutingModule
  ]
})
export class TransitManagementModule { }
