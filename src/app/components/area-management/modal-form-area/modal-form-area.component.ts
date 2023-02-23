
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Area } from 'src/app/domain/class';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-modal-form-area',
  templateUrl: './modal-form-area.component.html',
  styleUrls: ['./modal-form-area.component.css']
})
export class ModalFormAreaComponent implements OnInit, OnDestroy {

  public inputUserForm: FormGroup;
  private subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Area,
    private formBuilder: FormBuilder,
    private areaManagementService: AreaManagementService,
    private snackBar: SnackBar
  ) { }

  ngOnInit(): void {
    if (this.data.idArea) {
      this.inputUserForm = this.formBuilder.group({
        ctrlAreaName: [this.data.areaName, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      });
    } else {
      this.inputUserForm = this.formBuilder.group({
        ctrlAreaName: ['', [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

  public onSubmit(isAdd: boolean): void {
    const name = this.inputUserForm.get('ctrlAreaName')?.value;
    const formAreaAdd = new Area(name);
    if (isAdd) {
      this.areaManagementService.addArea(formAreaAdd).subscribe({
        next: (data: Area) => {
          this.snackBar.showMessage("Area inserita!", 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      });
    } else {
      const idArea = this.data.idArea;
      const formAreaEdit = new Area(name, idArea);
      this.areaManagementService.editArea(formAreaEdit).subscribe({
        next: (data: Area) => {
          this.snackBar.showMessage("Area modificata!", 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      });
    }
  }

}





