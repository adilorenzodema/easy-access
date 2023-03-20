import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Area, Park } from 'src/app/domain/class';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-modal-form-park',
  templateUrl: './modal-form-park.component.html',
  styleUrls: ['./modal-form-park.component.css']
})
export class ModalFormParkComponent implements OnInit, OnDestroy {

  inputUserForm: FormGroup;
  areas: Area[] = [];
  areaFiltered: Area[] = [];
  subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormParkComponent>,
    private formBuilder: FormBuilder,
    private parkManagementService: ParkManagementService,
    private areaManagementService: AreaManagementService,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getAreas();
    this.inputUserForm = this.formBuilder.group({
      ctrlParkName: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCountry: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
      ctrlParkCity: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF]*')]],
      ctrlParkCAP: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
      ctrlParkAddress: [null, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF0-9 ]*')]],
      ctrlAreaIdList: [null, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

  public onSubmit(): void {
    const name = this.inputUserForm.get('ctrlParkName')?.value;
    const country = this.inputUserForm.get('ctrlParkCountry')?.value;
    const city = this.inputUserForm.get('ctrlParkCity')?.value;
    const CAP = this.inputUserForm.get('ctrlParkCAP')?.value;
    const address = this.inputUserForm.get('ctrlParkAddress')?.value;
    const areaIdList = this.inputUserForm.get('ctrlAreaIdList')?.value;
    const formParkAdd = new Park(name, country, city, CAP, address);
    formParkAdd.areaIdList = areaIdList;
    console.log(formParkAdd);
    this.parkManagementService.addParking(formParkAdd).subscribe({
      next: () => this.snackBar.showMessage(this.translate.instant('manage_parks.insertParkSuccess'), 'INFO'),
      error: () => this.snackBar.showMessage(this.translate.instant('manage_parks.insertParkError'), 'ERROR'),
      complete: () => this.dialogRef.close(true)
    });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  private getAreas(): void {
    const keyword = "";
    const isActive = true;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe((res) => {
      this.areas = res;
      this.areaFiltered = this.areas.slice();
    }));
  }

}







