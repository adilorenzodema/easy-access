import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { Subscription } from 'rxjs';
import { PermissionType } from 'src/app/domain/interface';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-permission-type',
  templateUrl: './permission-type.component.html',
  styles: [
  ]
})
export class PermissionTypeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public complete = true;
  public dataSource = new MatTableDataSource<PermissionType>();
  /**
    *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
    * In Ordine: Descrizione tipo permesso, data ultima modifica, ultimo utente che ha modificaato, azioni eseguibili sul tipo di permesso
  */
  public displayedColumns: string[] = ['permissionTypeDesc', 'modificationDate', 'modificationUser', 'action'];
  public search: FormGroup;
  public operations: Operation[] = [];

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private dialog: MatDialog,
    private pagePermissionService: PagePermissionService,
    private permissionTypeService: PermissionTypeManagementService,
    private translate: TranslateService
  ) { }

  /*
   * Inizializza la barra di ricerca a stringa vuota
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
   * Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable
   */
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  /*
   * Popola la tabella dei tipi di permesso
  * */
  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.permissionTypeService.getPermissionType(keyword, isActive).subscribe({
      next: (permType) => (
        this.dataSource.data = permType,
        this.dataSource.paginator = this.paginator,
        //se modificationDate null allora fa sort per creationDate
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'modificationDate':
              return item.modificationDate? item.modificationDate : item.creationDate;
            default: return item[property];
          }
        },
        this.dataSource.sort = this.sort
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /*
   * Apre una finestra modale ed in base alla scelta dell'utente, disattiva un tipo di permesso.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   * @param id - L'ID del tipo di permesso da disattivare
  * */
  public onDisactivate(id: number): void {
    const title = this.translate.instant('manage_permission_type.disactivateTitle');
    const content = this.translate.instant('manage_permission_type.disactivateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {title, content},
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if (resp) {
          this.complete = false;
          this.subscription.push(this.permissionTypeService.disactivatePermissionType(id).subscribe({
            error: () => this.complete = true,
            complete: () => (this.snackBar.showMessage(
              this.translate.instant('manage_permission_type.permissionDisactivated'), 'INFO'), this.callGetAPI(), this.complete = true)
          }));
        }
      }
    );
  }

  /**
    * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva un'Area.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param id - L'ID del tipo di permesso da riattivare
    */
  public activePermissionType(id: number): void {
    const title = this.translate.instant('manage_permission_type.activateTitle');
    const content = this.translate.instant('manage_permission_type.activateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {
          title, content
        },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (resp: boolean) => {
        if (resp) {
          this.complete = false;
          this.subscription.push(this.permissionTypeService.activePermissionType(id).subscribe({
            error: () => this.complete = true,
            complete: () => (this.snackBar.showMessage(this.translate.instant('manage_permission_type.permissionActivated'),
              'INFO'), this.callGetAPI(), this.complete = true)
          }));
        }
      }
    );
  }

  /**
   * Apre una finestra modale ed in base alla scelta dell'utente, rimuove un tipo di permesso.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   * @param id - L'ID del tipo di permesso da eliminare
   */
  public deletePermissionType(id: number): void {
    const title = this.translate.instant('manage_permission_type.deleteTitle');
    const content = this.translate.instant('manage_permission_type.deleteConfirm');
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
          this.subscription.push(this.permissionTypeService.deletePermissionType(id).subscribe({
            next: () => this.callGetAPI(),
            error: () => this.snackBar.showMessage(this.translate.instant('manage_permission_type.deletionError'), "ERROR"),
            complete: () => this.snackBar.showMessage(this.translate.instant('manage_permission_type.deletionSuccess'), "INFO")
          }));
        }
      });
  }

  /**
   * Ritorna le operazioni disponibili all'utente nella pagina attuale in base al tipo del profilo.
   */
  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.pagePermissionService.getPermissionPage(currentUrl).subscribe(
      permission => this.operations = permission.operations
    ));
  }

}
