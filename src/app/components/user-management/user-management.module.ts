import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { ModalFormUserComponent } from './modal-form-user/modal-form-user.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { UserManagementRoutingModule } from './user-management.routing';

@NgModule({
  declarations: [
    UserManagementComponent,
    ModalFormUserComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }
