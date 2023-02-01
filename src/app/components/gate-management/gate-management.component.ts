
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { GateService } from 'src/app/service/gate-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Gate } from '../domain/class';
import { ModalFormGateComponent } from './modal-form-gate/modal-form-gate.component';

@Component({
  selector: 'app-gate-management',
  templateUrl: './gate-management.component.html',
  styleUrls: ['./gate-management.component.css']
})
export class GateManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['idGate', 'gateDescription', 'parkAssociate', 'action'];
  public dataSource = new MatTableDataSource<Gate>();
  public complete = true;
  public search!: FormGroup;
  public idPark: number;
  public namePark: string;

  private subscription: Subscription[] = [];

  constructor(
    private gateService: GateService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private dialog: MatDialog,
    private router: Router) {
    this.idPark = this.router.getCurrentNavigation()?.extras.state?.['idPark'] as number;
    this.namePark = this.router.getCurrentNavigation()?.extras.state?.['namePark'] as string;
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    if (this.idPark) {
      this.callGetAPIFiltered();
    } else {
      this.callGetAPI();
    }
  }

  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.gateService.getAllGates(keyword, isActive).subscribe({
      next: (gates) => (
        this.dataSource.data = gates,
        this.dataSource.sort = this.sort,
        this.dataSource.paginator = this.paginator
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public callGetAPIFiltered(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    this.gateService.getGateByPark(this.idPark).subscribe({
      next: (gate) => (
        this.dataSource.data = gate,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public addEditGate(gate?: Gate): void {
    const dialogRef = this.dialog.open(ModalFormGateComponent, { width: '40%', height: '65%', data: gate ? gate : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public deletePark(gateId: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Cancellazione parcheggio", content: "Desideri cancellare il parcheggio selezionato?" },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.gateService.deleteGate(gateId).subscribe({
            next: () => this.callGetAPI(),
            error: () => this.snackBar.showMessage('Errore nella rimozione', "ERROR"),
            complete: () => this.snackBar.showMessage('Varco rimosso', "INFO")
          }));
        }
      });
  }
}
