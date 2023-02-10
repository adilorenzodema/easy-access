import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public formGroup: FormGroup;
  public start = moment(moment.now()).subtract(2, 'day');
  public end = moment(moment.now());
  public dataSource = new MatTableDataSource<Permission>();
  public displayedColumns: string[] = ['idPermission', 'category', 'descrizionePermesso', 'codiceObu'];

  private subscription: Subscription[] = [];

  constructor(private permissionService: PermissionManagementService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
    });
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const start = moment(this.formGroup.get('start')?.value).format('yyyy-MM-DDHH:mm:ss');
      const end = moment(this.formGroup.get('end')?.value).format('yyyy-MM-DDHH:mm:ss');
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

}
