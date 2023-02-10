import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Park } from 'src/app/domain/class';
import { Gate } from 'src/app/domain/interface';
import { GateService } from 'src/app/service/gate-management.service';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-modal-form-gate',
  templateUrl: './modal-form-gate.component.html',
  styles: ['']
})
export class ModalFormGateComponent implements OnInit, OnDestroy {

  public inputUserForm: FormGroup;
  public parks: Park[] = [];
  private subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormGateComponent>,
    private formBuilder: FormBuilder,
    private gateService: GateService,
    private parkService: ParkManagementService,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Gate
  ) { }

  ngOnInit(): void {
    this.subscription.push(this.parkService.getParking('', true).subscribe(
      (respParks) => this.parks = respParks
    ));
    if (this.data) {
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [this.data.gateDescription, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
        ctrlParkId: [this.data.park?.idPark, Validators.required]
      });
    } else {
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
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
    if (isAdd) {
      const gateName = this.inputUserForm.get('ctrlGateName')?.value;
      const parkId = this.inputUserForm.get('ctrlParkId')?.value;
      this.subscription.push(this.gateService.addGate(gateName, parkId).subscribe({
        next: () => {
          this.snackBar.showMessage("Varco inserito!", 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      }));
    } else {
      const idGate = this.data.idGate;
      const gateName = this.inputUserForm.get('ctrlGateName')?.value;
      const parkId = this.inputUserForm.get('ctrlParkId')?.value;
      this.subscription.push(this.gateService.editGate(gateName, idGate, parkId).subscribe({
        next: () => {
          this.snackBar.showMessage("Varco modificato!", 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      }));
    }
  }

}







