import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { Subscription } from 'rxjs';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Area } from '../../domain/class';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area.component';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrls: ['./area-management.component.css']
})
export class AreaManagementComponent implements OnInit, OnDestroy {
  /**
     *Gestione della pagina /#/area-management
     */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
    *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
    * In Ordine: Id dell'Area, Nome, Utente da cui è stata creata, Data di creazione, Nome dell'ultimo utente che la ha modificata, Data dell'ultima modifica,
    * azioni eseguibili sull'area
    */
  public displayedColumns: string[] = ['idArea', 'areaName', 'creationUser', 'creationDate', 'modificationUser', 'modificationDate', 'action'];
  public dataSource = new MatTableDataSource<Area>();
  public search: FormGroup;
  public complete = true;
  public areaName: string;
  public operations: Operation[] = [];
  private subscription: Subscription[] = [];

  constructor(
    public translate: TranslateService,
    private areaManagementService: AreaManagementService,
    private permissionService: PagePermissionService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private dialog: MatDialog) { }

  /**
      *Inizializza la barra di ricerca (stringa vuota) e la toggle-slide (true).
      *Poi popola la tabella con la callGetAPI() e ritorna tutti i permessi disponibili all'utente con la getPermissionAPI()
      */
  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    this.callGetAPI();
    this.getPermissionAPI();
  }

  /**
    *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
    */
  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  /**
     * Apre una finestra modale ed passa il valore dell'elemento al componente responsabile per l'aggiunta o la modifica di un'area.
     * @param element - Se presente, l'Area da modificiare. Se undefined, fa aggiungere una nuova Area.
     */
  public add(element?: Area): void {
    const dialogRef = this.dialog.open(ModalFormAreaComponent, { width: '25%', height: '27%', data: element ? element : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }
  /**
    * Apre una finestra modale ed in base alla scelta dell'utente, disattiva un'Area.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param areaId - L'ID dell'Area da disattivare
    */
  public onDisactivate(areaId: number): void {
    const title = this.translate.instant('manage_areas.disactivateTitle');
    const content = this.translate.instant('manage_areas.disactivateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.areaManagementService.disactivateArea(areaId).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_areas.disactivationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.disactivationSuccess'), "INFO")
            }));
        }
      });
  }
  /**
    * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva un'Area.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param areaId - L'ID dell'Area da riattivare
    */
  public activateArea(areaId: number): void {
    const title = this.translate.instant('manage_areas.activateTitle');
    const content = this.translate.instant('manage_areas.activateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.areaManagementService.activateArea(areaId).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_areas.activationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.activationSuccess'), "INFO")
            }));
        }
      });
  }

  /**
  * Apre una finestra modale ed in base alla scelta dell'utente, rimuove un'Area.
  * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
  * @param areaId - L'ID dell'Area da rimuovere
  */
  public deleteArea(areaId: number): void {
    const title = this.translate.instant('manage_areas.deleteTitle');
    const content = this.translate.instant('manage_areas.deleteConfirm');
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
          this.subscription.push(this.areaManagementService.deleteArea(areaId).subscribe({
            next: () => this.callGetAPI(),
            complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.deletionSuccess'), "INFO")
          }));
        }
      });
  }


  /**
   * Ritorna una lista di oggetti di tipo Area, in base ai parametri di ricerca(Una keyword e lo status dell'Area[Active o Inactive])
   */
  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe({
      next: areas => {
        this.dataSource.data = areas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
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




