import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormConfirmComponent } from './modal-form-confirm/modal-form-confirm.component';

@NgModule({
  declarations: [ModalFormConfirmComponent],
  imports: [
    CommonModule
  ],
  exports: [ModalFormConfirmComponent]
})
export class SharedComponentsModule { }
