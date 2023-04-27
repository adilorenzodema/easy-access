import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkManagementRoutingModule } from './park-management.routing';
import { ParkManagementComponent } from './park-management.component';
import { LibMaterialModule, LibPipesModule } from 'dema-movyon-template';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalFormParkComponent } from './modal-form-park/modal-form-park.component';
import { TitleParkComponent } from './title-park/title-park.component';
import { EditParkComponent } from './edit-park/edit-park.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableAssociatedAreasComponent } from './table-associated-areas/table-associated-areas.component';
import { TableAssociatedGatesComponent } from './table-associated-gates/table-associated-gates.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [
    ParkManagementComponent,
    ModalFormParkComponent,
    TitleParkComponent,
    EditParkComponent,
    TableAssociatedAreasComponent,
    TableAssociatedGatesComponent
  ],
  imports: [
    CommonModule,
    LibMaterialModule,
    LibPipesModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ParkManagementRoutingModule,
    TranslateModule,
    NgScrollbarModule
  ]
})
export class ParkManagementModule { }
