import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponentComponent } from './logs-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';


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
    ReactiveFormsModule,
    NgScrollbarModule
  ]
})
export class LogsModule { }
