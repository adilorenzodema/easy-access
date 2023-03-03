import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchManagementRoutingModule } from './batch-management-routing.module';
import { BatchManagementComponent } from './batch-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';


@NgModule({
  declarations: [BatchManagementComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    LibMaterialModule,
    LibPipesModule,
    BatchManagementRoutingModule
  ]
})
export class BatchManagementModule { }
