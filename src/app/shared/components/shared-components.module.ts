import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormConfirmComponent } from './modal-form-confirm/modal-form-confirm.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../modules/material.module';

@NgModule({
  declarations: [ModalFormConfirmComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [ModalFormConfirmComponent]
})
export class SharedComponentsModule { }
