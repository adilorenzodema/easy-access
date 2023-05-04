import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Gate, GateStatus, Incident } from 'src/app/domain/interface';
import { GateService } from 'src/app/service/gate-management.service';
import { GatePilotingService } from 'src/app/service/gate-piloting.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-gate-status',
  templateUrl: './gate-status.component.html',
  styleUrls: ['./gate-status.component.css']
})
export class GateStatusComponent implements OnInit, OnDestroy {
  /*
  * *Gestione della pagina /#/gate-management/gate-status
  */
  public gate: Gate;
  /**
   *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella dello storico incidenti
   *In Ordine: Data di inizio dell'incidente, Data di fine, nome del varco, nome del parcheggio associato, nome del device che ha generato l'errore,
   *codice d'erorre e status attuale del varco (Incidente risolto/Incidente in corso)
   */
  public displayedColumns: string[] = ['startDate', 'endDate', 'gateName', 'parkName', 'device', 'errorCode', 'errorMessage', 'status'];
  public dataSource = new MatTableDataSource<Incident>();
  public complete = true;
  public gateStatus: GateStatus;
  public isActive: boolean;
  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: SnackBar,
    private translate: TranslateService,
    private gateService: GateService,
    private gatePilotingService: GatePilotingService
  ) {
    /*
    *Quando sulla pagina di gestione varchi si viene rimandati a questa pagina, viene passato un oggetto contenete tutte le info del varco
    *che ha eseguito la chiamata.
    *In caso questo oggetto sia assenti, si viene re-indirizzati alla pagina di gestione varchi
    */
    this.gate = this.router.getCurrentNavigation()?.extras.state?.['gate'] as Gate;
    if (!this.gate) { this.router.navigate(['/gate-management']); }
  }

  /**
     *Popola la tabella degli incidenti rilevati con la funzione gateIncidentApi().
     *Popola il resto della pagina con i dati ritornati dalla funzione getGateInfo().
     */
  ngOnInit(): void {
    this.gateIncidentApi();
    this.getGateInfo();
  }

  /**
   *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
   */
  ngOnDestroy(): void {
    this.subscription.map((sub) => sub.unsubscribe());
  }

  /*
  *Testa che la connessione al varco sia funzionante. La maggior parte della logica di questa funzione, come il resto della pagina
  *ha molto più senso se si guarda il Backend.
  */
  public testGateConnection(): void {
    this.complete = false;
    this.subscription.push(this.gatePilotingService.testGateConnection(this.gate.idGate).subscribe({
      error: () => this.complete = true,
      complete: () => {
        this.snackBar.showMessage(this.translate.instant('manage_gates.testOk'), "INFO");
        this.complete = true;
      }
    }));
  }

  /**
   * Ritorna una lista di oggetti di tipo GateStatus e valorizza la variabile isActive, utilizzata per determinare lo stato dell'Antenna
   */
  public getGateInfo(): void {
    this.complete = false;
    this.subscription.push(this.gatePilotingService.getGateInfo(this.gate.idGate).subscribe({
      next: (gateStatus) => (
        this.gateStatus = gateStatus,
        this.isActive = gateStatus.functionality.antenna === "enabled" ? true : false
      ),
      error: () => this.complete = true,
      complete: () => {
        this.complete = true;
      }
    }));
  }

  /**
* Apre una finestra modale ed in base alla scelta dell'utente, riavvia le funzionalità dell'antenna associata.
* Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
*/
  public reboot(): void {
    const title = this.translate.instant('manage_gates.gateStatus.rebootTitle');
    const content = this.translate.instant('manage_gates.gateStatus.rebootConfirm');
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
          this.subscription.push(this.gatePilotingService.rebootGate(this.gate.idGate).subscribe({
            next: () => this.snackBar.showMessage(this.translate.instant('manage_gates.rebootOk'), "INFO"),
            error: () => this.complete = true
          }));
        }
      });
  }

  /**
   * Apre una finestra modale ed in base alla scelta dell'utente, disattiva l'antenna associata.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   */
  public disactive(): void {
    const title = this.translate.instant('manage_gates.gateStatus.disactivateTitle');
    const content = this.translate.instant('manage_gates.gateStatus.disactivateConfirm');
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
          this.subscription.push(this.gatePilotingService.deactivateGate(this.gate.idGate).subscribe({
            error: () => this.complete = true,
            complete: () => {
              this.complete = true;
              this.snackBar.showMessage(this.translate.instant('manage_gates.disactiveOk'), "INFO");
              this.isActive = false;
            }
          }));
        }
      });
  }

  /**
   * Apre una finestra modale ed in base alla scelta dell'utente, ri-attiva l'antenna associata.
   * Quando termina con errore o successo, genera una snackbar con l'appropriato messaggio.
   */
  public active(): void {
    const title = this.translate.instant('manage_gates.gateStatus.activateTitle');
    const content = this.translate.instant('manage_gates.gateStatus.activateConfirm');
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
          this.subscription.push(this.gatePilotingService.activateGate(this.gate.idGate).subscribe({
            error: () => this.complete = true,
            complete: () => {
              this.complete = true;
              this.snackBar.showMessage(this.translate.instant('manage_gates.activeOk'), "INFO");
              this.isActive = true;
            }
          }));
        }
      });
  }

  /*
  * Apre una finestra modale ed in base alla scelta dell'utente, attiva una delle modalità della sbarra.
  *openGate() attiva la modalità AperturaForzata,  closeGate() attiva la modalità chiusuraForzata, autoGate() attiva la modalità automatica.
  */
  public openGate(): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Apertura sbarra", content: "Desideri aprire la sbarra selezionata?" },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gatePilotingService.openGate(this.gate.idGate).subscribe({
            next: () => this.snackBar.showMessage(this.translate.instant('manage_gates.openOk'), "INFO"),
            error: () => this.complete = true
          }));
        }
      });
  }

  public closeGate(): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Chiusura sbarra", content: "Desideri chiudere la sbarra selezionata?" },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gatePilotingService.closeGate(this.gate.idGate).subscribe({
            next: () => this.snackBar.showMessage(this.translate.instant('manage_gates.closeOk'), "INFO"),
            error: () => this.complete = true
          }));
        }
      });
  }

  public autoGate(): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Attivazione modalità automatica", content: "Desideri impostare la modalità automatica per il device selezionato?" },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gatePilotingService.autoGate(this.gate.idGate).subscribe({
            next: () => this.snackBar.showMessage(this.translate.instant('manage_gates.autoOk'), "INFO"),
            error: () => this.complete = true
          }));
        }
      });
  }

  /**
    * Ritorna una lista di oggetti di tipo Incidenti, usati per popolare la tabella incidenti
    */
  private gateIncidentApi(): void {
    this.complete = false;
    this.subscription.push(this.gateService.getGateIncident(this.gate.idGate).subscribe({
      next: (incidents) => {
        this.dataSource.data = incidents;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

}
