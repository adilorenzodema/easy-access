import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
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
  public operations: Operation[] = [];
  private subscription: Subscription[] = [];

  constructor(
    public translate: TranslateService,
    private areaManagementService: AreaManagementService,
    private permissionService: PagePermissionService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private dialog: MatDialog) { }

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

  public add(element?: Area): void {
    const dialogRef = this.dialog.open(ModalFormAreaComponent, { width: '25%', height: '27%', data: element ? element : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public onDisactivate(areaId: number): void {
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
          this.subscription.push(this.areaManagementService.disactivateArea(areaId).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_areas.disactivationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.disactivationSuccess'), "INFO")
            }));
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
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_areas.activationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.activationSuccess'), "INFO")
            }));
        }
      });
  }

  public deleteArea(areaId: number): void {
    const title = this.translate.instant('manage_areas.deleteTitle');
    const content = this.translate.instant('manage_areas.deleteConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '35%', height: '25%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.areaManagementService.deleteArea(areaId).subscribe({
            next: () => this.callGetAPI(),
            error: () => this.snackBar.showMessage(this.translate.instant('manage_areas.deletionError'), "ERROR"),
            complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.deletionSuccess'), "INFO")
          }));
        }
      });
  }

  /**
   * This function performs a GET request to the backend API to retrieve a list of areas.
   * It then updates the data source of the current component to display the returned list of areas.
   */
  public callGetAPI(): void {
    // Set the "complete" property to false to indicate that the request is still ongoing.
    this.complete = false;
    // Retrieve the search keyword and isActive status from the search parameters.
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    // Subscribe to the observable returned by the "getAreaList" method of the "areaManagementService".
    // When the observable emits a value (i.e., the list of areas), update the data source of the component with the returned data.
    // If an error occurs during the request, set the "complete" property to true to indicate that the request is complete.
    // If the request completes successfully, also set the "complete" property to true to indicate that the request is complete.

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
      permission => this.operations = permission.operations
    ));
  }


}




