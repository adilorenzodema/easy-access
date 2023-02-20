import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/domain/interface';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';

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

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private permissionTypeService: PermissionTypeManagementService
  ) { }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    this.callGetAPI();
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
    this.complete = false;
    this.subscription.push(this.permissionTypeService.deletePermissionType(id).subscribe({
      error: () => this.complete = true,
      complete: () => (this.snackBar.showMessage('permesso disattivato', 'INFO'), this.callGetAPI(), this.complete = true)
    }));
  }

  public activePermissionType(id: number): void {
    this.complete = false;
    this.subscription.push(this.permissionTypeService.activePermissionType(id).subscribe({
      error: () => this.complete = true,
      complete: () => (this.snackBar.showMessage('permesso disattivato', 'INFO'), this.callGetAPI(), this.complete = true)
    }));
  }

}
