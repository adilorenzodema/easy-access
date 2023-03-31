
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['idGate', 'gateDescription', 'parkAssociate','gateDirection','ipAntenna','portAntenna','codeAntenna', 'action'];
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
    this.idPark = this.router.getCurrentNavigation()?.extras.state?.['idPark'] as number;
    this.namePark = this.router.getCurrentNavigation()?.extras.state?.['namePark'] as string;
  }

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

  ngOnDestroy(): void {
    this.subscription.forEach(
      (sub) => sub.unsubscribe()
    );
  }

  public callGetAPI(): void {
    this.complete = false;
    const parkKeyword = this.search.get('ctrlParkSearch')?.value;
    const gateKeyword = this.search.get('ctrlGateSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.gateService.getAllGates(parkKeyword,gateKeyword, isActive).subscribe({
      next: (gates) => (
        this.dataSource.data = gates,
        this.dataSource.sort = this.sort,
        this.dataSource.paginator = this.paginator
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public addEditGate(gate?: Gate): void {
    const dialogRef = this.dialog.open(ModalFormGateComponent, { width: '50%', height: '45%', data: gate ? gate : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

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
  public activateGate(gateId: number): void{
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

  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      permission => this.operations = permission.operations
    ));
  }
}
