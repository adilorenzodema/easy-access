import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Gate, Park } from 'src/app/components/domain/class';
import { GateService } from 'src/app/service/gate.service';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-modal-form-gate',
  templateUrl: './modal-form-gate.component.html',
  styles: ['']
})
export class ModalFormGateComponent implements OnInit, OnDestroy {

  public inputUserForm!: FormGroup;
  public parks: Park[] = [];
  private subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormGateComponent>,
    private formBuilder: FormBuilder,
    private gateService: GateService,
    private parkService: ParkManagementService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Gate
  ) { }

  ngOnInit(): void {
    if (this.data.gateName) {
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [this.data.gateName, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkId: [this.data.idPark, Validators.required]
      });
    } else {
      this.subscription.push(this.parkService.getParking('').subscribe(
        (parks) => this.parks = parks
      ));
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkId: [null, Validators.required]
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

  public onSubmit(isAdd: boolean): void {
    const name = this.inputUserForm.get('ctrlGateName')?.value;
    const idPark = this.inputUserForm.get('ctrlParkId')?.value;
    const formGateAdd = new Gate(name, idPark);
    if (isAdd) {
      this.gateService.addGate(formGateAdd).subscribe({
        next: (data: Gate) => {
          this.snackBar.open("Varco inserito!", "X", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'INFO'
          });
        },
        error: () => {
          this.snackBar.open("Errore!", "X");
        },
        complete: () => this.dialogRef.close(true)
      });
    } else {
      const idGate = this.data.idGate;
      const name = this.inputUserForm.get('ctrlGateName')?.value;
      const idPark = this.inputUserForm.get('ctrlParkId')?.value;
      const formGateEdit = new Gate(name, idPark, idGate);
      this.gateService.editGate(formGateEdit).subscribe({
        next: (data: Gate) => {
          this.snackBar.open("Varco modificato!", "X", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'INFO'
          });
        },
        error: () => {
          this.snackBar.open("Errore!", "X");
        },
        complete: () => this.dialogRef.close(true)
      });
    }
  }

}







