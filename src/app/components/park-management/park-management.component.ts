import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { Subscription } from 'rxjs';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Area, Park } from '../../domain/class';
import { ModalFormParkComponent } from './modal-form-park/modal-form-park.component';
import { AreaManagementService } from 'src/app/service/area-management.service';


@Component({
  selector: 'app-park-management',
  templateUrl: './park-management.component.html',
  styleUrls: ['./park-management.component.css']
})
export class ParkManagementComponent implements OnInit, AfterViewInit {
  /**
   * Gestione della pagina /#/parkmanagement
  */

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public search: FormGroup;
  public dataSource = new MatTableDataSource<Park>();

  /**
    *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
    * In Ordine: id parcheggio, nome parcheggio, posizione, utente che l'ha creato, data di creazione, l'ultimo utente che l'ha modificato,
    * data ultima modifica, azioni eseguibili sul parcheegggio
    */
  public displayedColumns: string[] =
    ['idPark', 'namePark', 'location', 'creationUser', 'creationDate', 'modificationUser', 'modificationDate', 'action'];
  public areaName: string;
  public idArea: number;
  public complete = true;
  public operations: Operation[];
  public areas: Area[] = [];
  public areaFiltered: Area[] = [];
  private subscription: Subscription[] = [];


  constructor(
    private parkingService: ParkManagementService,
    private permissionService: PagePermissionService,
    private areaManagementService: AreaManagementService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) {
    this.idArea = this.router.getCurrentNavigation()?.extras.state?.['idArea'] as number;
    this.areaName = this.router.getCurrentNavigation()?.extras.state?.['areaName'] as string;
  }

  /*
   * Popola select delle aree, prende lista dei parcheggi attivi
  * */
  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true],
      ctrlAreaIdList: [null]
    });
    this.getAreas();
    this.callGetAPI();
    this.getPermissionAPI();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /**
   * Ritorna una lista di oggetti di tipo Parcheggio, in base ai parametri di ricerca(Una keyword,
   * lo status del parcheggio[Active o Inactive] o l'id dell'Area associata)
   */
  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    const areaId = this.search.get('ctrlAreaIdList')?.value;
    this.parkingService.getParking(keyword, isActive, areaId).subscribe({
      next: park => {
        this.dataSource.data = park;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  /*
   * Apre una finestra modale per l'inserimento di un parcheggio
   * I dati da inserire sono: nome, stato, città, cap, indirizzo e aree associate
   * @param {Park} [park]
  * */
  public addPark(park?: Park): void {
    const dialogRef = this.dialog.open(ModalFormParkComponent, { width: '40%', height: '50%', data: park ? park : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  /**
   * Apre una finestra modale ed in base alla scelta dell'utente, disattiva un Parcheggio.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   * @param {number} parkId
   */
  public onDisactivate(parkId: number): void {
    const title = this.translate.instant('manage_parks.disactivateTitle');
    const content = this.translate.instant('manage_parks.disactivateConfirm');
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
      (result) => {
        if (result) {
          this.subscription.push(this.parkingService.disactivatePark(parkId).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_parks.disactivationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_parks.disactivationSuccess'), "INFO")
            }));
        }
      });
  }

  /*
   * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva un Parcheggio.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   * @param {number} parkId
  * */
  public activePark(parkId: number): void {
    const title = this.translate.instant('manage_parks.activateTitle');
    const content = this.translate.instant('manage_parks.activateConfirm');
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
      (result) => {
        if (result) {
          this.subscription.push(this.parkingService.activatePark(parkId).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_parks.disactivationError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_parks.disactivationSuccess'), "INFO")
            }));
        }
      });
  }

  /*
    * Apre una finestra modale ed in base alla scelta dell'utente, rimuove un Parcheggio.
    * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
    * @param {number} parkId
  * */
  public deletePark(parkId: number): void {
    const title = this.translate.instant('manage_parks.deleteTitle');
    const content = this.translate.instant('manage_parks.deleteConfirm');
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
          this.subscription.push(this.parkingService.deletePark(parkId).subscribe(
            {
              next: () => this.callGetAPI(),
              error: () => this.snackBar.showMessage(this.translate.instant('manage_parks.deleteError'), "ERROR"),
              complete: () => this.snackBar.showMessage(this.translate.instant('manage_parks.deletionSuccess'), "INFO")
            }));
        }
      });
  }

  /*
   * Prende la lista di oggetti di tipo Area
   * @memberOf ParkManagementComponent
  * */
  private getAreas(): void {
    const keyword = "";
    const isActive = true;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe((res) => {
      this.areas = res;
      this.areaFiltered = this.areas.slice();
      this.areaFiltered.sort((a:any ,b:any )=> a.areaName.localeCompare(b.areaName));
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
