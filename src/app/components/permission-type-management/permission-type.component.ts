import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/domain/interface';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-permission-type',
  templateUrl: './permission-type.component.html',
  styles: [
  ]
})
export class PermissionTypeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public complete = true;
  public dataSource = new MatTableDataSource<PermissionType>();
  public displayedColumns: string[] = ['idTipoPermesso', 'descrizioneTipoPermesso', 'action'];
  public search: FormGroup;
  public operations: Operation[] = [];

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private dialog: MatDialog,
    private pagePermissionService: PagePermissionService,
    private permissionTypeService: PermissionTypeManagementService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    this.callGetAPI();
    this.getPermissionAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.permissionTypeService.getPermissionType(keyword, isActive).subscribe({
      next: (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public deletePermissionType(id: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {
          title: "Cancellazione tipo di permesso", content: "Desideri disattivare il tipo di permesso selezionato?"
        },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if (resp) {
          this.complete = false;
          this.subscription.push(this.permissionTypeService.deletePermissionType(id).subscribe({
            error: () => this.complete = true,
            complete: () => (this.snackBar.showMessage(
              this.translate.instant('manage_permission_type.permissionDisactivated'), 'INFO'), this.callGetAPI(), this.complete = true)
          }));
        }
      }
    );
  }

  public activePermissionType(id: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {
          title: "Riattivazione tipo di permesso", content: "Desideri riattivare il tipo di permesso selezionato?"
        },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if (resp) {
          this.complete = false;
          this.subscription.push(this.permissionTypeService.activePermissionType(id).subscribe({
            error: () => this.complete = true,
            complete: () => (this.snackBar.showMessage(this.translate.instant('manage_permission_type.permissionActivated'),
              'INFO'), this.callGetAPI(), this.complete = true)
          }));
        }
      }
    );
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.pagePermissionService.getPermissionPage(currentUrl).subscribe(
      permission => this.operations = permission.operations
    ));
  }

}
