import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EfcListManagementRoutingModule } from './efc-list-management-routing.module';
import { EfcListManagementComponent } from './efc-list-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [EfcListManagementComponent],
  imports: [
    CommonModule,
    EfcListManagementRoutingModule,
    LibMaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    LibPipesModule,
    NgScrollbarModule

  ]
})
export class EfcListManagementModule { }
