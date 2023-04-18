import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagePermissionService } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { ParkStatus, TableIncident } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public parkStatus: ParkStatus[] = [];
  public complete = true;
  public operations: Operation[] = [];
  public allIncidentList: TableIncident[] = [];

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
      next: (status) => {this.parkStatus = status;
        console.log(this.parkStatus);},
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  private saveAllIncident(): void {
    this.parkStatus.forEach(
      (park) => park.incidentList.forEach(
        (list) => this.allIncidentList.push({ parkName: park.parkName, incident: list })
      )
    );
  }
  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      permission => { this.operations = permission.operations; }
    ));
  }


}
