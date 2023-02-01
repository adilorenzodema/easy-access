import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PermissionManagementService } from 'src/app/service/permission-management.service';
import { Permission } from '../../domain/interface';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css']
})
export class PermissionManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public complete = true;
  public dataSource = new MatTableDataSource<Permission>();
  public displayedColumns: string[] = ['idPermesso', 'codiceObu', 'descrizionePermesso'];

  constructor(private permissionService: PermissionManagementService) { }

  ngOnInit(): void {
    this.callGetAPI();
  }

  public callGetAPI(): void {
    this.complete = false;
    this.permissionService.getTransitList().subscribe({
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
