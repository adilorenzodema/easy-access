import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PermissionManagementService } from 'src/app/service/permission-management.service';
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
  public dataSource = new MatTableDataSource<Permission>();
  public displayedColumns: string[] = ['idPermesso', 'codiceObu', 'descrizionePermesso'];

  private subscription: Subscription[] = [];

  constructor(private permissionService: PermissionManagementService) { }

  ngOnInit(): void {
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  public callGetAPI(): void {
    this.complete = false;
    const start = moment(moment.now()).format('yyyy-MM-DD');
    const end = moment(moment.now()).format('yyyy-MM-DD');
    this.subscription.push(this.permissionService.getPermission(start, end).subscribe({
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
