import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionService } from 'src/app/service/permission.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  constructor(private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.getPermissionAPI();
  }

  ngOnDestroy(): void {
    this.subscription.map(
      (subscription) => subscription.unsubscribe()
    );
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.pathname).replace('/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      resp => console.log(resp)
    ));
  }

}
