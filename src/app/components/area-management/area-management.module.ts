import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AreaManagementRoutingModule } from './area-management.routing';
import { AreaManagementComponent } from './area-management.component';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { LibMaterialModule } from 'dema-movyon-template';
import { PipesModuleModule } from 'src/app/shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { TableAssociatedParkComponent } from './table-associated-park/table-associated-park.component';
import { TableAssociatedUsersComponent } from './table-associated-users/table-associated-users.component';




@NgModule({
  declarations: [
    AreaManagementComponent,
    ModalFormAreaComponent,
    EditAreaComponent,
    TableAssociatedParkComponent,
    TableAssociatedUsersComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LibMaterialModule,
    AreaManagementRoutingModule,
    SharedComponentsModule,
    PipesModuleModule,
    TranslateModule
  ]
})
export class AreaManagementModule { }
