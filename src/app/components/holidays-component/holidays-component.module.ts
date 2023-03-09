import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HolidaysComponentRoutingModule } from './holidays-component-routing.module';
import { HolidaysComponentComponent } from './holidays-component.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';



@NgModule({
  declarations: [
    HolidaysComponentComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HolidaysComponentRoutingModule,
    TranslateModule,
    NgxMultipleDatesModule,
  ],
  providers: [DatePipe]
})
export class HolidaysComponentModule { }
