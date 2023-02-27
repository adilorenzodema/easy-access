import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AddEditGate, Park } from 'src/app/domain/class';
import { Gate } from 'src/app/domain/interface';
import { GateService } from 'src/app/service/gate-management.service';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { DIRECTION } from 'src/app/shared/costants/constants';


@Component({
  selector: 'app-modal-form-gate',
  templateUrl: './modal-form-gate.component.html',
  styles: ['']
})
export class ModalFormGateComponent implements OnInit, OnDestroy {

  public inputUserForm: FormGroup;
  public parks: Park[] = [];
  public direction = DIRECTION;
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
        ctrlGateName: [this.data.gateDescription, [Validators.required, /* Validators.pattern('^[a-zA-Z0-9_.- ]*$')] */]],
        ctrlGateDirection: [this.data.gateDirection, [Validators.required]],
        ctrlIpAntenna: [this.data.ipAntenna, [Validators.required, Validators.pattern('^[0-9.]*$')]],
        ctrlPortAntenna: [this.data.portAntenna, [Validators.required, Validators.pattern('^[0-9]*$')]],
        ctrlCodeAntenna: [this.data.codeAntenna, [Validators.required]],
        ctrlParkId: [this.data.park?.idPark, Validators.required]
      });
    } else {
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [null, [Validators.required, /* Validators.pattern('^[a-zA-Z0-9_.- ]*$') */]],
        ctrlParkId: [null, Validators.required],
        ctrlGateDirection: [null, [Validators.required]], //ENTRATA, USCITA, DOPPIO SENSO
        ctrlIpAntenna: [null, [Validators.required, Validators.pattern('^[0-9.]*$')]], //ip
        ctrlPortAntenna: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
        ctrlCodeAntenna: [null, Validators.required]
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
      const gateDirection = this.inputUserForm.get('ctrlGateDirection')?.value;
      const ipAntenna = this.inputUserForm.get('ctrlIpAntenna')?.value;
      const portAntenna = this.inputUserForm.get('ctrlPortAntenna')?.value;
      const codeAntenna = this.inputUserForm.get('ctrlCodeAntenna')?.value;
      const formGateAdd = new AddEditGate(parkId,gateName,gateDirection, ipAntenna, portAntenna, codeAntenna);
      console.log("add");
      console.log(formGateAdd);
      this.subscription.push(this.gateService.addGate(formGateAdd).subscribe({
        next: () => {
          this.snackBar.showMessage("Varco inserito!", 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      }));
    } else {
      const idGate = this.data.idGate;
      const gateName = this.inputUserForm.get('ctrlGateName')?.value;
      const parkId = this.inputUserForm.get('ctrlParkId')?.value;
      const gateDirection = this.inputUserForm.get('ctrlGateDirection')?.value;
      const ipAntenna = this.inputUserForm.get('ctrlIpAntenna')?.value;
      const portAntenna = this.inputUserForm.get('ctrlPortAntenna')?.value;
      const codeAntenna = this.inputUserForm.get('ctrlCodeAntenna')?.value;
      const formGateAdd = new AddEditGate(parkId,gateName,gateDirection, ipAntenna, portAntenna, codeAntenna);
      formGateAdd.idGate = idGate;
      console.log("edit");
      console.log(formGateAdd);
      this.subscription.push(this.gateService.editGate(formGateAdd).subscribe({
        next: () => {
          this.snackBar.showMessage("Varco modificato!", 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      }));
    }
  }

}







