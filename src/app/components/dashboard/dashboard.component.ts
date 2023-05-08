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
    this.getParkStatusAPI();
    this.getPermissionAPI();
  }

  /**
  *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
  */
  ngOnDestroy(): void {
    this.subscription.map(
      (subscription) => subscription.unsubscribe()
    );
  }

  /**
   * Ritorna una lista di oggetti di tipo ParkStatus.
   */
  private getParkStatusAPI(): void {
    this.complete = false;
    this.subscription.push(this.parkService.getParkStatus().subscribe({
      next: (status) => {
        this.parkStatus = status;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /*
  * Inutilizzata
  */
  private saveAllIncident(): void {
    this.parkStatus.forEach(
      (park) => park.incidentList.forEach(
        (list) => this.allIncidentList.push({ parkName: park.parkName, incident: list })
      )
    );

  }

  /**
   * Ritorna le operazioni disponibili all'utente nella pagina attuale in base al tipo del profilo.
   */
  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      permission => { this.operations = permission.operations; }
    ));
  }


}
