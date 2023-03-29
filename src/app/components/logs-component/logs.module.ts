import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { LogsRoutingModule } from './logs-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LibMaterialModule,
    LibPipesModule,
    FlexLayoutModule,
    TranslateModule,
    LogsRoutingModule
  ]
})
export class LogsModule { }
