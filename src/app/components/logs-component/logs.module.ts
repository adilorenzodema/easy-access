import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponentComponent } from './logs-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LogsComponentComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    LibPipesModule,
    FlexLayoutModule,
    TranslateModule,
    LogsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LogsModule { }
