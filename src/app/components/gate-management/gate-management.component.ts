
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Gate } from 'src/app/domain/interface';
import { GateService } from 'src/app/service/gate-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { ModalFormGateComponent } from './modal-form-gate/modal-form-gate.component';

@Component({
  selector: 'app-gate-management',
  templateUrl: './gate-management.component.html',
  styleUrls: ['./gate-management.component.css']
})
export class GateManagementComponent implements OnInit, OnDestroy {
  /*
  * *Gestione della pagina /#/gate-management
  */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
   *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
   * In Ordine: Nome/Descrizione del varco, nome del parcheggio associato, verso del varco, Indirizzo IP dell'antenna collegata, porta dell'antenna,
   * codice identificativo dell'antenna, data dell'ultima modifica, nome dell'utente che ha effettuato l'ultima modifica, azioni eseguibili
   */
  public displayedColumns: string[] = [
    'gateDescription', 'parkAssociate', 'gateDirection', 'ipAntenna', 'portAntenna', 'codeAntenna',
    'modificationDate', 'modificationUser', 'action'
  ];
  public dataSource = new MatTableDataSource<Gate>();
  public complete = true;
  public search: FormGroup;
  public idPark: number;
  public namePark: string;
  public operations: Operation[];

  private subscription: Subscription[] = [];

  constructor(
    private gateService: GateService,
    private permissionService: PagePermissionService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private dialog: MatDialog,
    private router: Router,
    private translate: TranslateService) {
    /*
    *Quando sulla pagina di gestione parcheggio si viene rimandati a questa pagina, viene passato l'ID ed il nome delparcheggio che ha eseguito la chiamata
    */
    this.idPark = this.router.getCurrentNavigation()?.extras.state?.['idPark'] as number;
    this.namePark = this.router.getCurrentNavigation()?.extras.state?.['namePark'] as string;
  }

  /**
    *Inizializza le barre di ricerca (Ricerca per nome parcheggio, ricerca per nome varco) con stringa vuota e la toggle-slide (true).
    *Poi popola la tabella con la callGetAPI() e ritorna tutti i permessi disponibili all'utente con la getPermissionAPI()
    */
  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlGateSearch: [''],
      ctrlParkSearch: [''],
      ctrlActive: [true]
    });
    this.callGetAPI();
    this.getPermissionAPI();
  }

  /**
   *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
   */
  ngOnDestroy(): void {
    this.subscription.forEach(
      (sub) => sub.unsubscribe()
    );
  }

  /**
 * Ritorna una lista di oggetti di tipo Gate, in base ai parametri di ricerca(Due keyword e lo status dell'Area[Active o Inactive])
 */
  public callGetAPI(): void {
    this.complete = false;
    const parkKeyword = this.search.get('ctrlParkSearch')?.value;
    const gateKeyword = this.search.get('ctrlGateSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.gateService.getAllGates(parkKeyword, gateKeyword, isActive).subscribe({
      next: (gates) => (
        this.dataSource.data = gates,
        this.dataSource.sort = this.sort,
        //A differenza delle altre tabelle, sono assenti le colonne CreationDate/User, che vengono eventualmente inizializzate dentro le colonne di modifica
        //se modificationDate null allora fa sort per creationDate
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'modificationDate':
              return item.modificationDate ? item.modificationDate : item.creationDate;
            case 'parkAssociate': return item.park.namePark; /* sort per nome parcheggio associato in colonna parkAssociate */
            default: return item[property];
          }
        },
        this.dataSource.paginator = this.paginator
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /**
   * Apre una finestra modale ed passa il valore dell'elemento al componente responsabile per l'aggiunta o la modifica di un varco.
   * La finestra modale è gestita dla componente ModalFormGateComponent.
   * @param gate - Se presente, il varco da modificiare. Se undefined, fa aggiungere un nuovo varco.
   */
  public addEditGate(gate?: Gate): void {
    const dialogRef = this.dialog.open(ModalFormGateComponent, { width: '50%', height: '45%', data: gate ? gate : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  /**
    * Apre una finestra modale ed in base alla scelta dell'utente, disattiva un varco.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param gateId - L'ID del varco da disattivare
    */
  public onDisactivate(gateId: number): void {
    const title = this.translate.instant('manage_gates.disactivateTitle');
    const content = this.translate.instant('manage_gates.disactivateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '35%', height: '25%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gateService.disactivateGate(gateId).subscribe({
            next: () => this.callGetAPI(),
            error: () => this.snackBar.showMessage(this.translate.instant('manage_gates.deactivationError'), "ERROR"),
            complete: () => this.snackBar.showMessage(this.translate.instant('manage_gates.deactivationSuccess'), "INFO")
          }));
        }
      });
  }

   /**
    * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva un varco.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param gateId - L'ID del varco da ri-attivare
    */
  public activateGate(gateId: number): void {
    const title = this.translate.instant('manage_gates.activateTitle');
    const content = this.translate.instant('manage_gates.activateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '35%', height: '25%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gateService.activateGate(gateId).subscribe({
            next: () => this.callGetAPI(),
            error: () => this.snackBar.showMessage(this.translate.instant('manage_gates.activationError'), "ERROR"),
            complete: () => this.snackBar.showMessage(this.translate.instant('manage_gates.activationSuccess'), "INFO")
          }));
        }
      });
  }

  /**
  * Apre una finestra modale ed in base alla scelta dell'utente, rimuove un varco.
  * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
  * @param gateId - L'ID del varco da rimuovere
  */
  public deleteGate(gateId: number): void {
    const title = this.translate.instant('manage_gates.deleteTitle');
    const content = this.translate.instant('manage_gates.deleteConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '35%', height: '25%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gateService.deleteGate(gateId).subscribe({
            next: () => this.callGetAPI(),
            error: () => this.snackBar.showMessage(this.translate.instant('manage_gates.deletionError'), "ERROR"),
            complete: () => this.snackBar.showMessage(this.translate.instant('manage_gates.deletionSuccess'), "INFO")
          }));
        }
      });
  }

  /**
     * Ritorna le operazioni disponibili all'utente nella pagina attuale in base al tipo del profilo.
     */
  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      permission => this.operations = permission.operations
    ));
  }
}
