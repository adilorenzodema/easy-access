import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBar } from 'dema-movyon-template';
import { AddTypePermission } from 'src/app/domain/class';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';

@Component({
  selector: 'app-add-edit-permission-type',
  templateUrl: './add-edit-permission-type.component.html',
  styles: [`
  .timeSlot {
    width: 60%;
    border: 2px solid #49beaa;
    border-radius: 10px;
    padding: 2%;
    margin: 1%;
  }
  `
  ]
})
export class AddEditPermissionTypeComponent implements OnInit {
  public formGroup: FormGroup;
  public days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  public holidays = ['holiday', 'preHoliday'];
  public complete = true;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private permissionTypeService: PermissionTypeManagementService,
    private router: Router
  ) { }

  get timesSlot(): FormArray {
    return this.formGroup.get('ctrlTimesSlot') as FormArray;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlName: ['', Validators.required],
      ctrlTimesSlot: this.formBuilder.array([this.buildTimeSlotArray()]),
    });
  }

  public addPermissionType(): void {
    this.complete = false;
    const name = this.formGroup.get('ctrlName').value;
    const list = this.formGroup.get('ctrlTimesSlot').value;
    const newPermissionType = new AddTypePermission(name, list);
    this.permissionTypeService.addPermissionType(newPermissionType).subscribe({
      error: () => this.complete = true,
      complete: () => (this.snackBar.showMessage('tipo permesso inserito correttamente', 'INFO'),
      this.router.navigate(['/permission-type-management']) , this.complete = true)
    });
  }

  public addTimeSlot(): void {
    this.timesSlot.push(this.buildTimeSlotArray());
  }

  public removeTimeSlot(index: number): void {
    this.timesSlot.removeAt(index);
  }

  public buildTimeSlotArray(): FormGroup {
    return this.formBuilder.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false],
      holiday: [false],
      preHoliday: [false]
    });
  }

}
