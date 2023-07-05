import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagePermissionService } from 'dema-movyon-template';
import { Subscription, forkJoin } from 'rxjs';
import { ParkStatus, TableIncident } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  /**
    *Gestione della pagina /#/dashboard
    */
  public parkStatus: ParkStatus[] = [];
  public complete = true;
  public operations: Operation[] = [];
  public allIncidentList: TableIncident[] = [];

  private subscription: Subscription[] = [];
  constructor(
    private permissionService: PagePermissionService,
    private parkService: ParkManagementService) { }

  /**
  * getParkStatusAPI() Popola la variabile ParkStatus con i dati relativi ad i parcheggi associati all'utente. Visualizzati come una lista di <mat-card-content>
  * getPermissionAPI() Ritorna tutti i permessi disponibili all'utente con la getPermissionAPI()
  */
  ngOnInit(): void {
    this.callApi();
  }

  /**
  *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
  */
  ngOnDestroy(): void {
    this.subscription.map(
      (subscription) => subscription.unsubscribe()
    );
  }

  private callApi(): void {
    this.complete = false;
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(forkJoin({
      // Ritorna una lista di oggetti di tipo ParkStatus.
      parkStatus: this.parkService.getParkStatus(),
      // Ritorna le operazioni disponibili all'utente nella pagina attuale in base al tipo del profilo.
      permission: this.permissionService.getPermissionPage(currentUrl)
    })
      .subscribe({
        next: ({ parkStatus, permission }) => {
          this.parkStatus = parkStatus;
          this.operations = permission.operations;
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }))
  }


}
