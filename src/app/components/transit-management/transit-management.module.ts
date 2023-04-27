import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibMaterialModule } from 'dema-movyon-template';
import { TransitManagementRoutingModule } from './transit-management-routing.module';
import { TransitComponent } from './transit.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    TransitComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TransitManagementRoutingModule,
    TranslateModule,
    NgScrollbarModule
  ]
})
export class TransitManagementModule { }
