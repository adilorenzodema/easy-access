import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PagePermissionService } from 'dema-movyon-template';
import { Operation } from 'dema-movyon-template/lib/components/domain/interface';
import { interval, Subscription } from 'rxjs';
import { Job } from 'src/app/domain/interface';
import { BatchManagementService } from 'src/app/service/batch-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-batch-management',
  templateUrl: './batch-management.component.html',
  styleUrls: ['./batch-management.component.css']
})
export class BatchManagementComponent implements OnInit, OnDestroy {
  /**
    *Gestione della pagina /#/batch-management
    */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
    *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
    *In ordine: Nome del Job, Descrizione, chronExpression collegata, traduzione della chronExpression, Data della prossima esecuzione, flag programmato,
    *azioni eseguibili sul Job
    */
  public displayedColumns: string[] = ['jobName', 'jobDescription', 'chronExpression', 'chronDescription', 'nextRunDate', 'scheduled', 'action'];
  public complete = true;
  public search: FormGroup;
  public dataSource = new MatTableDataSource<Job>();
  public active: FormGroup;
  public operations: Operation[] = [];

  private subscription: Subscription[] = [];
  private interval: Subscription;

  constructor(
    public translate: TranslateService,
    private batchManagementService: BatchManagementService,
    private pagePermissionService: PagePermissionService,
    private dialog: MatDialog,
  ) { }

  /**
      *Dato che alcuni Job possono essere eseguiti più volte nel giro di minuti, ogni minuto viene ri-effettuata la chiamata GET.
      *Popola la tabella con la callGetAPI() e ritorna tutti i permessi disponibili all'utente con la getPermissionAPI()
      */
  ngOnInit(): void {
    this.interval = interval(60000).subscribe(
      () => this.callGetAPI()
    );
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
    this.interval.unsubscribe();
  }

  /**
    *Ritorna una lista di oggetti di tipo Job.
    */
  public callGetAPI(): void {
    this.complete = false;
    this.subscription.push(this.batchManagementService.getAllJobs().subscribe({
      next: jobs => {
        this.dataSource.data = jobs;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /**
   * Apre una finestra modale ed in base alla scelta dell'utente, disabilita un Job.
   * @param jobName - Nome del Job da disattivare.
   */
  public disableJob(jobName: string): void {
    const title = this.translate.instant('manage_batches.disactivateTitle');
    const content = this.translate.instant('manage_batches.disactivateConfirm');
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
          this.subscription.push(this.batchManagementService.disableJob(jobName).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  /**
  * Apre una finestra modale ed in base alla scelta dell'utente, abilita un Job.
  * @param jobName - Nome del Job da ri-abilitare.
  */
  public enableJob(jobName: string): void {
    const title = this.translate.instant('manage_batches.activateTitle');
    const content = this.translate.instant('manage_batches.activateConfirm');
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
          this.subscription.push(this.batchManagementService.enableJob(jobName).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  /**
  * Apre una finestra modale ed in base alla scelta dell'utente, lancia l'esecuzione di un Job.
  * @param jobName - Nome del Job da eseguire.
  */
  public runJob(jobName: string): void {
    const title = this.translate.instant('manage_batches.executeJobTitle');
    const content = this.translate.instant('manage_batches.executeJobConfirm');
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
          this.subscription.push(this.batchManagementService.runJob(jobName).subscribe(
            () => this.callGetAPI()
          ));
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
