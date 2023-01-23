import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Park } from 'src/app/components/domain/class';
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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.data.idParcheggio) {
      this.inputUserForm = this.formBuilder.group({
        ctrlParkName: [this.data.nomeParcheggio, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCountry: [this.data.paese, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCity: [this.data.localita, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
        ctrlParkCAP: [this.data.cap, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
        ctrlParkAddress: [this.data.indirizzo, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF0-9 ]*')]],
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
          this.snackBar.open("Parcheggio inserito!", "X", {
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
      const idPark = this.data.idParcheggio;
      const name = this.inputUserForm.get('ctrlParkName')?.value;
      const country = this.inputUserForm.get('ctrlParkCountry')?.value;
      const city = this.inputUserForm.get('ctrlParkCity')?.value;
      const CAP = this.inputUserForm.get('ctrlParkCAP')?.value;
      const address = this.inputUserForm.get('ctrlParkAddress')?.value;
      const formParkEdit = new Park(name, country, city, CAP, address, idPark);
      this.parkManagementService.editParking(formParkEdit).subscribe({
        next: (data: Park) => {
          console.log(data);
          this.snackBar.open("Parcheggio modificato!", "X", {
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

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }


}







