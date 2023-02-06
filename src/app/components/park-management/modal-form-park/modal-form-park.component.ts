import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Park } from 'src/app/domain/class';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-modal-form-park',
  templateUrl: './modal-form-park.component.html',
  styleUrls: ['./modal-form-park.component.css']
})
export class ModalFormParkComponent implements OnInit, OnDestroy {

  inputUserForm!: FormGroup;
  subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormParkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Park,
    private formBuilder: FormBuilder,
    private parkManagementService: ParkManagementService,
    private snackBar: SnackBar
  ) { }

  ngOnInit(): void {
    if (this.data.idPark) {
      this.inputUserForm = this.formBuilder.group({
        ctrlParkName: [this.data.namePark, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCountry: [this.data.country, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCity: [this.data.location, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCAP: [this.data.cap, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
        ctrlParkAddress: [this.data.address, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF0-9 ]*')]],
      });
    } else {
      this.inputUserForm = this.formBuilder.group({
        ctrlParkName: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCountry: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCity: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCAP: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
        ctrlParkAddress: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF0-9 ]*')]],
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

  public onSubmit(isAdd: boolean): void {
    const name = this.inputUserForm.get('ctrlParkName')?.value;
    const country = this.inputUserForm.get('ctrlParkCountry')?.value;
    const city = this.inputUserForm.get('ctrlParkCity')?.value;
    const CAP = this.inputUserForm.get('ctrlParkCAP')?.value;
    const address = this.inputUserForm.get('ctrlParkAddress')?.value;
    const formParkAdd = new Park(name, country, city, CAP, address);
    if (isAdd) {
      this.parkManagementService.addParking(formParkAdd).subscribe({
        next: (data: Park) => {
          console.log(data);
          this.snackBar.showMessage("Parcheggio inserito!", 'INFO');
        },
        error: () => {
          this.snackBar.showMessage("Errore!", 'ERROR');
        },
        complete: () => this.dialogRef.close(true)
      });
    } else {
      const idPark = this.data.idPark;
      const name = this.inputUserForm.get('ctrlParkName')?.value;
      const country = this.inputUserForm.get('ctrlParkCountry')?.value;
      const city = this.inputUserForm.get('ctrlParkCity')?.value;
      const CAP = this.inputUserForm.get('ctrlParkCAP')?.value;
      const address = this.inputUserForm.get('ctrlParkAddress')?.value;
      const formParkEdit = new Park(name, country, city, CAP, address, idPark);
      this.parkManagementService.editParking(formParkEdit).subscribe({
        next: (data: Park) => {
          this.snackBar.showMessage("Parcheggio modificato!", 'INFO');
        },
        error: () => {
          this.snackBar.showMessage("Errore!", 'ERROR');
        },
        complete: () => this.dialogRef.close(true)
      });
    }
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }


}







