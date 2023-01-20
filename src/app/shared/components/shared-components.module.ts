import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormConfirmComponent } from './modal-form-confirm/modal-form-confirm.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LibMaterialModule } from 'dema-movyon-template';

@NgModule({
  declarations: [ModalFormConfirmComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LibMaterialModule
  ],
  exports: [ModalFormConfirmComponent]
})
export class SharedComponentsModule { }
