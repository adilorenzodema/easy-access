import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PagePermissionService } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Incident, ParkStatus, TableIncident } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public parkStatus: ParkStatus[] = [];
  public allIncidentList: TableIncident[] = [];
  public complete = true;
  public dataSource = new MatTableDataSource<TableIncident>();
  public displayedColumns = ['idIncident', 'errorMessage', 'parkName', 'device', 'startDate'];

  private subscription: Subscription[] = [];
  constructor(
    private permissionService: PagePermissionService,
    private parkService: ParkManagementService) { }

  ngOnInit(): void {
    this.getParkStatusAPI();
    this.getPermissionAPI();
  }

  ngOnDestroy(): void {
    this.subscription.map(
      (subscription) => subscription.unsubscribe()
    );
  }

  private getParkStatusAPI(): void {
    this.complete = false;
    this.subscription.push(this.parkService.getParkStatus().subscribe({
      next: (status) => (
        this.parkStatus = status,
        this.saveAllIncident(),
        this.dataSource.data = this.allIncidentList,
        this.dataSource.sort = this.sort,
        this.dataSource.paginator = this.paginator
      ),
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

  private saveAllIncident(): void {
    this.parkStatus.forEach(
      (park) => park.incidentList.forEach(
        (list) => this.allIncidentList.push({ parkName: park.parkName, incident: list })
      )
    );
  }

}
