import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { Subscription } from 'rxjs';
import { EFC } from 'src/app/domain/interface';
import { EfcListManagementService } from 'src/app/service/efc-list-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-efc-list-management',
  templateUrl: './efc-list-management.component.html',
  styleUrls: ['./efc-list-management.component.css']
})
export class EfcListManagementComponent implements OnInit {
  /*
   * *Gestione della pagina /#/efc-list-management
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
   *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
   * In Ordine: Codice relativo all'EFC, il service provider, flag attivo/disattivo, azioni eseguibili
   */
  public displayedColumns: string[] = ['efcCode', 'serviceProvider', 'flagActive', 'action'];
  public dataSource = new MatTableDataSource<any>();
  public search: FormGroup;
  public complete = true;
  public operations: Operation[] = [];
  private subscription: Subscription[] = [];
  constructor(
    private permissionService: PagePermissionService,
    private efcListService: EfcListManagementService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private snackBar: SnackBar,
    private dialog: MatDialog
  ) { }

  /**
    *Inizializza la barra di ricerca (stringa vuota).
    *Poi popola la tabella con la callGetAPI() e ritorna tutti i permessi disponibili all'utente con la getPermissionAPI()
    */
  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: ['']
    });
    this.callGetAPI();
    this.getPermissionAPI();
  }

  /**
   * Ritorna una lista di oggetti di tipo EFC, in base ai parametri di ricerca(Una keyword)
   * Poi ordina i dati, mostrando per primi gli efc attivi.
   */
  public callGetAPI(): void {
    this.complete = false;
    const efcCode = this.search.get('ctrlSearch')?.value;
    this.subscription.push(this.efcListService.getEfcList(efcCode).subscribe({
      next: efc => {
        efc.sort((a: EFC, b: EFC) => +b.flagActive - +a.flagActive); //sort per flagActive = true
        this.dataSource.data = efc;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /**
    * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva un'EFC.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param efcCode - Codice dell'EFC da riattivare
    */
  public activate(efcCode: String): void {
    const title = this.translate.instant('manage_efc.activateTitle');
    const content = this.translate.instant('manage_efc.activateConfirm');
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
          this.subscription.push(this.efcListService.activateEfc(efcCode).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_efc.activationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_efc.activationSuccess'), "INFO")
            }));
        }
      });
  }

  /**
  * Apre una finestra modale ed in base alla scelta dell'utente, disattiva un'EFC.
  * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
  * @param efcCode - Codice dell'EFC da disattivare
  */
  public disactivate(efcCode: String): void {
    const title = this.translate.instant('manage_efc.disactivateTitle');
    const content = this.translate.instant('manage_efc.disactivateConfirm');
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
          this.subscription.push(this.efcListService.deactivateEfc(efcCode).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_efc.disactivationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_efc.disactivationSuccess'), "INFO")
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
