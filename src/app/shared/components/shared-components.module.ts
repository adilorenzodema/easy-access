import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormConfirmComponent } from './modal-form-confirm/modal-form-confirm.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LibMaterialModule } from 'dema-movyon-template';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalFormConfirmComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LibMaterialModule,
    TranslateModule
  ],
  exports: [ModalFormConfirmComponent]
})
export class SharedComponentsModule { }
