import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HolidaysComponentRoutingModule } from './holidays-component-routing.module';
import { HolidaysComponentComponent } from './holidays-component.component';
import { LibMaterialModule } from 'dema-movyon-template';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
import { PipesModuleModule } from "../../shared/pipes/pipes.module";



@NgModule({
    declarations: [
        HolidaysComponentComponent
    ],
    providers: [DatePipe],
    imports: [
        CommonModule,
        LibMaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        HolidaysComponentRoutingModule,
        TranslateModule,
        NgxMultipleDatesModule,
        PipesModuleModule
    ]
})
export class HolidaysComponentModule { }
