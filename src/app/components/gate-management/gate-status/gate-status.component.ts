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
  public gate: Gate;
  public displayedColumns: string[] = ['startDate', 'endDate', 'gateName', 'parkName', 'device', 'errorCode', 'status'];
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
    this.gate = this.router.getCurrentNavigation()?.extras.state?.['gate'] as Gate;
    if (!this.gate) { this.router.navigate(['/gate-management']); }
  }

  ngOnInit(): void {
    this.gateIncidentApi();
    this.getGateInfo();
  }

  ngOnDestroy(): void {
    this.subscription.map((sub) => sub.unsubscribe());
  }

  public testGateConnection(): void {
    this.complete = false;
    this.subscription.push(this.gatePilotingService.testGateConnection(this.gate.idGate).subscribe({
      error: () => this.complete = true,
      complete: () => {
        this.snackBar.showMessage(this.translate.instant('manage_gates.testOk'), "INFO");
        this.complete = true;}
    }));
  }

  public getGateInfo(): void {
    this.complete = false;
    this.subscription.push(this.gatePilotingService.getGateInfo(this.gate.idGate).subscribe({
      next: (gateStatus) => (
        this.gateStatus = gateStatus,
        this.isActive = gateStatus.functionality.antenna === "enabled" ? true : false,
        console.log(this.gateStatus)),
      error: () => this.complete = true,
      complete: () => {
        this.snackBar.showMessage("GateInfo", "INFO");
        this.complete = true;}
    }));
  }

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

  public disactive(): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Disattivazione device", content: "Desideri disattivare il device selezionato?" },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gatePilotingService.deactivateGate(this.gate.idGate).subscribe({
            error: () => this.complete = true,
            complete: ()=>{
              this.complete = true;
              this.snackBar.showMessage(this.translate.instant('manage_gates.disactiveOk'), "INFO");
              this.isActive = false;
            }
          }));
        }
      });
  }

  public active(): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Attivazione device", content: "Desideri attivare il device selezionato?" },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gatePilotingService.activateGate(this.gate.idGate).subscribe({
            error: () => this.complete = true,
            complete: ()=>{
              this.complete = true;
              this.snackBar.showMessage(this.translate.instant('manage_gates.activeOk'), "INFO");
              this.isActive = true;
            }
          }));
        }
      });
  }

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

  private gateIncidentApi(): void {
    this.complete = false;
    this.subscription.push(this.gateService.getGateIncident(this.gate.idGate).subscribe({
      next: (incidents) =>{
        this.dataSource.data = incidents;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

}
