import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Area } from '../../domain/class';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area.component';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrls: ['./area-management.component.css']
})
export class AreaManagementComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['idArea', 'areaName', 'creationUser', 'creationDate', 'modificationUser', 'modificationDate', 'action'];
  public dataSource = new MatTableDataSource<Area>();
  public search: FormGroup;
  public complete = true;
  public areaName: string;
  private subscription: Subscription[] = [];

  constructor(
    public translate: TranslateService,
    private areaManagementService: AreaManagementService,
    private permissionService: PagePermissionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    this.callGetAPI();
    this.getPermissionAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public addEdit(element?: Area): void {
    const dialogRef = this.dialog.open(ModalFormAreaComponent, { width: '40%', height: '50%', data: element ? element : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public onDelete(areaId: number): void {
    const title = this.translate.instant('manage_areas.disactivateTitle');
    const content = this.translate.instant('manage_areas.disactivateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.areaManagementService.deleteArea(areaId).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  public activateArea(areaId: number): void {
    const title = this.translate.instant('manage_areas.activateTitle');
    const content = this.translate.instant('manage_areas.activateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.areaManagementService.activateArea(areaId).subscribe(
            () => this.callGetAPI()
          ));
        }
      });

  }

  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe({
      next: areas => {
        this.dataSource.data = areas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      resp => null
    ));
  }


}




