import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibMaterialModule } from 'dema-movyon-template';
import { IncidentsRoutingModule } from './incidents-management-routing.module';
import { IncidentsComponent } from './incidents.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    IncidentsComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    IncidentsRoutingModule,
    TranslateModule,
    NgScrollbarModule
  ]
})
export class IncidentsManagementModule { }

