import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Permission, PermissionInterporto, PermissionSearchStatus } from '../../domain/interface';
import { Park } from 'src/app/domain/class';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { PermissionInterportoManagementService } from 'src/app/service/permission-interporto-management.service';
import { PermissionManagementService } from 'src/app/service/permission-management.service';

@Component({
  selector: 'app-permission-interporto-management',
  templateUrl: './permission-interporto-management.component.html',
  styleUrls: ['./permission-interporto-management.component.css']
})
export class PermissionInterportoManagementComponent implements OnInit, OnDestroy {
  /**
   * Pagina di gestione dei permessi
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public complete = true;
  public formGroup: FormGroup;
  public start = moment(moment.now()).subtract(21, 'day');
  public end = moment(moment.now());
  public dataSource = new MatTableDataSource<PermissionInterporto>();

  /**
    *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
    * In Ordine: categoria di permesso, stato permesso, tipo di perm, data utlima modifica,
    * codice obu associato, data di inizio validità, data fine validità, azioni eseguibili sul permesso
    * azioni eseguibili sull'area
    */
  public displayedColumns: string[] =
    ['category', 'permissionStatus', 'permissionType', 'modificationDate', 'modificationUser', 'title','validationDateStart', 'validationDateEnd', 'company','action'];
  public operations: Operation[] = [];
  public permissionStatus: PermissionSearchStatus = 'VALID';
  public parks: Park[] = [];
  private subscription: Subscription[] = [];

  constructor(
    private permissionInterportoService: PermissionInterportoManagementService,
    private permissionService: PermissionManagementService,
    private pagePermissionService: PagePermissionService,
    private parkManagementService : ParkManagementService,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) {
  }

  /**
   * Inizializza la barra di ricerca
   * Popola la tabella con callGetAPI(), la select delle aree associate all'utente con getArea()
   */
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlStart: new FormControl(moment(this.start).toDate(), Validators.required),
      ctrlEnd: new FormControl(moment(this.end).toDate(), Validators.required),
      ctrlObuSearch: new FormControl(''),
      ctrlLicenseSearch: new FormControl(''),
      ctrlPermTypeSearch: new FormControl(''),
      ctrlActive: new FormControl(true),
      idPark: new FormControl(),
      category: new FormControl('')
    });
    this.callGetAPI();
    this.getPermissionAPI();
    // this.getArea();
    this.getParks();
    this.dataSource.filterPredicate = (data: PermissionInterporto, filter: string) => {
      return data.permissionStatus === filter;
    };
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  public applyFilter(filterValue: PermissionSearchStatus): void {
    if (filterValue === 'ALL') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue;
    }
  }

  /**
   * Ritorna una lista di oggetti di tipo Permission, in base ai parametri di ricerca(Una keyword)
   */
  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const isActive = this.formGroup.get('ctrlActive')?.value;
      const obuSearch = this.formGroup.get('ctrlObuSearch')?.value;
      const licenseSearch = this.formGroup.get('ctrlLicenseSearch')?.value;
      const permtypeSearch = this.formGroup.get('ctrlPermTypeSearch')?.value;
      const start = moment(this.formGroup.get('ctrlStart')?.value).format('yyyy-MM-DD HH:mm:ss');
      const end = moment(this.formGroup.get('ctrlEnd')?.value).format('yyyy-MM-DD' + "23:59:59");
      const idPark = this.formGroup.get('idPark')?.value;
      const category = this.formGroup.get('category')?.value;
      //Orario inizio deve essere 00:00, orario fine 23:59
      this.subscription.push(this.permissionInterportoService.getPermission(start, end, isActive, obuSearch, licenseSearch ,permtypeSearch, idPark, category).subscribe({
        next: (permission) => (
          this.dataSource.data = permission,
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
        complete: () => (this.applyFilter(this.permissionStatus), this.complete = true)
      }));
    }
  }

  /**
   * Apre una finestra modale ed in base alla scelta dell'utente, disattiva un permesso.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   *
   * @param {number} id
   */
  public onDisactivate(id: number): void {
    const title = this.translate.instant('manage-permission.disactivateTitle');
    const content = this.translate.instant('manage-permission.disactivateConfirm');
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title, content },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.complete = false;
          this.subscription.push(this.permissionService.disactivatePermission(id).subscribe({
            error: () => (this.complete = true, this.snackBar.showMessage(this.translate.instant('manage-permission.disactivationError'),
              'ERROR'), this.callGetAPI()),
            complete: () => (this.complete = true, this.snackBar.showMessage(this.translate.instant('manage-permission.permissionDisactivated'),
              'INFO'), this.callGetAPI())
          }));
        }
      });
  }


  /**
    * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva un permesso.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param id - id del permesso da attivare
    */
  public activePermission(id: number): void {
    const title = this.translate.instant('manage-permission.activateTitle');
    const content = this.translate.instant('manage-permission.activateConfirm');
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
          this.complete = false;
          this.subscription.push(this.permissionService.activePermission(id).subscribe({
            error: () => (this.complete = true, this.snackBar.showMessage(this.translate.instant('manage-permission.activationError'),
              'ERROR'), this.callGetAPI()),
            complete: () => (this.complete = true, this.snackBar.showMessage(this.translate.instant('manage-permission.permissionActivated'),
              'INFO'), this.callGetAPI())
          }));
        }
      });
  }

  /*
   * Apre una modale di conferma, ed in base alla scelta dell'utente, elimina un permesso che ha l'id passato
   * @param {number} id
  * */
  public deletePermission(id: number): void {
    const title = this.translate.instant('manage-permission.deleteTitle');
    const content = this.translate.instant('manage-permission.deleteConfirm');
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
          this.subscription.push(this.permissionService.deletePermission(id).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage-permission.deleteError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage-permission.deleteSuccess'), "INFO")
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
      permission => {
        this.operations = permission.operations;
      },
    ));
  }

  // private getArea(): void{
  //   const isActive = true;
  //   const keyword = "";

  //   this.subscription.push(this.areaService.getAreaList(keyword, isActive).subscribe(
  //     areas => (
  //       this.areas = areas
  //     )
  //   ));
  // }

  /**
   * Popola la select per la ricerca per parcheggio
   */
  private getParks(): void{
    this.subscription.push(this.parkManagementService.getAssociatedParksToUser().subscribe(
      (r) => {
        this.parks = r;
      }
    ));
  }
}
