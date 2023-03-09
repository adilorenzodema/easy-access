import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PermissionManagementService } from 'src/app/service/permission-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Permission } from '../../domain/interface';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css']
})
export class PermissionManagementComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public complete = true;
  public formGroup: FormGroup;
  public start = moment(moment.now()).subtract(2, 'day');
  public end = moment(moment.now());
  public dataSource = new MatTableDataSource<Permission>();
  public displayedColumns: string[] =
    ['idPermission', 'category', 'permissionType', 'creationDate', 'codiceObu', 'validationDateStart', 'validationDateEnd', 'action'];

  private subscription: Subscription[] = [];

  constructor(
    private permissionService: PermissionManagementService,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlStart: new FormControl(moment(this.start).toDate(), Validators.required),
      ctrlEnd: new FormControl(moment(this.end).toDate(), Validators.required),
      ctrlObuSearch: new FormControl(''),
      ctrlPermTypeSearch: new FormControl(''),
      ctrlActive: new FormControl(true)
    });
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const isActive = this.formGroup.get('ctrlActive')?.value;
      const obuSearch = this.formGroup.get('ctrlObuSearch')?.value;
      const permtypeSearch = this.formGroup.get('ctrlPermTypeSearch')?.value;
      const start = moment(this.formGroup.get('ctrlStart')?.value).format('yyyy-MM-DD HH:mm:ss');
      const end = moment(this.formGroup.get('ctrlEnd')?.value).format('yyyy-MM-DD HH:mm:ss');
      this.subscription.push(this.permissionService.getPermission(start, end, isActive, obuSearch, permtypeSearch).subscribe({
        next: (permission) => (
          this.dataSource.data = permission,
          this.dataSource.paginator = this.paginator,
          this.dataSource.sort = this.sort
        ),
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
    }
  }

  public deletePermission(id: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {
          title: "Cancellazione permesso", content: "Desideri disattivare il permesso selezionato?"
        },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.complete = false;
          this.subscription.push(this.permissionService.deletePermission(id).subscribe({
            error: () => this.complete = true,
            complete: () => (this.complete = true, this.snackBar.showMessage(this.translate.instant('manage-permission.permissionDisactivated'),
              'INFO'), this.callGetAPI())
          }));
        }
      });
  }

  public activePermission(id: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {
          title: "Riattivazione permesso", content: "Desideri attivare il permesso disattivato?"
        },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.complete = false;
          this.subscription.push(this.permissionService.activePermission(id).subscribe({
            error: () => this.complete = true,
            complete: () => (this.complete = true, this.snackBar.showMessage(this.translate.instant('manage-permission.permissionActivated'),
              'INFO'), this.callGetAPI())
          }));
        }
      });
  }

}
