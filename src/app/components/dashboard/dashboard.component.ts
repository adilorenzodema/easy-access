import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagePermissionService } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { ParkStatus } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public parkStatus: ParkStatus[] = [];
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
    this.subscription.push(this.parkService.getParkStatus().subscribe(
      (status) => this.parkStatus = status
    ));
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      resp => null
    ));
  }

}
