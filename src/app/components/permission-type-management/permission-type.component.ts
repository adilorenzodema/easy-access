import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public complete = true;
  public dataSource = new MatTableDataSource<PermissionType>();
  public displayedColumns: string[] = ['idTipoPermesso', 'descrizioneTipoPermesso'];

  private subscription: Subscription[] = [];

  constructor(
    private permissionTypeService: PermissionTypeManagementService
  ) { }

  ngOnInit(): void {
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(
      (sub) => sub.unsubscribe()
    );
  }

  public callGetAPI(): void {
    this.complete = false;
    this.permissionTypeService.getPermissionType().subscribe({
      next: (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

}
