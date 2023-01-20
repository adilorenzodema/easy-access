import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AreaManagementRoutingModule } from './area-management.routing';
import { AreaManagementComponent } from './area-management.component';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area/modal-form-area.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { LibMaterialModule } from 'dema-movyon-template';

@NgModule({
  declarations: [
    AreaManagementComponent,
    ModalFormAreaComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LibMaterialModule,
    AreaManagementRoutingModule,
    SharedComponentsModule
  ]
})
export class AreaManagementModule { }
