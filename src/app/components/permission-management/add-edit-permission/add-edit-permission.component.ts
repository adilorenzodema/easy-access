import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AddPermanentPermission, AddTemporaryPermission, Area } from 'src/app/domain/class';
import { Category, Permission, PermissionType } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { PermissionManagementService } from 'src/app/service/permission-management.service';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styles: [
  ]
})
export class AddEditPermissionComponent implements OnInit {
  public formGroup: FormGroup;
  public areas: Area[] = [];
  public areaFiltered: Area[] = [];
  public permissionTypes: PermissionType[] = [];
  public permissionTypesFiltered: PermissionType[] = [];
  public permission: Permission;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: SnackBar,
    private permissionService: PermissionManagementService,
    private areaManagementService: AreaManagementService,
    private permissionTypeService: PermissionTypeManagementService
  ) {
    this.permission = this.router.getCurrentNavigation()?.extras.state?.['permission'] as Permission;
  }

  ngOnInit(): void {
    this.getAreas();
    if (this.permission) {
      this.formGroup = this.formBuilder.group({
        ctrlCategory: [this.permission.category, Validators.required],
        ctrlObu: [this.permission.obu.obuCode, Validators.required],
        ctrlAreaIdList: ['', Validators.required],
        ctrlDateStart: [this.permission.validationDateStart, Validators.required],
        ctrlDateEnd: [this.permission.validationDateEnd, Validators.required],
      });
      if (this.permission.category === 'T') { // temporaneo
        this.formGroup.addControl('ctrlHourStart', this.formBuilder.control('', Validators.required));
        this.formGroup.addControl('ctrlHourEnd', this.formBuilder.control('', Validators.required));
      } else if (this.permission.category === 'P') { // permanente
        this.getPermissionType();
        this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control(this.permission.permissionType.permissionTypeId, Validators.required));
      }
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlCategory: ['', Validators.required],
        ctrlObu: ['', Validators.required],
        ctrlAreaIdList: ['', Validators.required],
        ctrlDateStart: ['', Validators.required],
        ctrlDateEnd: ['', Validators.required],
      });
    }
  }

  public changeCategory(): void {
    const categoryValue: Category = this.formGroup.get('ctrlCategory').value;
    if (categoryValue === 'T') { // temporaneo
      this.formGroup.addControl('ctrlHourStart', this.formBuilder.control('', Validators.required));
      this.formGroup.addControl('ctrlHourEnd', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlTypePermissionList');
    } else if (categoryValue === 'P') { // permanente
      if (this.permissionTypes.length === 0) { this.getPermissionType(); }
      this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlHourStart');
      this.formGroup.removeControl('ctrlHourEnd');
    }
  }

  public dateValidator(): void {
    const dateStart = this.formGroup.get('ctrlDateStart')?.value;
    const dateEnd = this.formGroup.get('ctrlDateEnd')?.value;
    if (dateStart && dateEnd && dateEnd < dateStart) {
      this.formGroup.controls['ctrlDateStart'].setErrors({ invalidDate: true });
    } else {
      this.formGroup.controls['ctrlDateStart'].setErrors(null);
    }
  }

  public addPermission(): void {
    this.complete = false;
    const categoryValue: Category = this.formGroup.get('ctrlCategory').value;
    const obuCode = this.formGroup.get('ctrlObu').value;
    const startDate = this.formGroup.get('ctrlDateStart').value;
    const endDate = this.formGroup.get('ctrlDateEnd').value;
    const idAreasSelected = this.formGroup.get('ctrlAreaIdList').value;
    if (categoryValue === 'T') { // temporaneo
      const startHour = this.formGroup.get('ctrlHourStart').value;
      const endHour = this.formGroup.get('ctrlHourEnd').value;
      const addTemp = new AddTemporaryPermission(obuCode, startDate, endDate, idAreasSelected, startHour, endHour);
      this.subscription.push(this.permissionService.addTemporaryPermission(addTemp).subscribe({
        error: () => this.complete = true,
        complete: () => (this.snackBar.showMessage('permesso inserito', 'INFO'), this.complete = true)
      }));
    } else if (categoryValue === 'P') { // permanente
      const permissionTypeList = this.formGroup.get('ctrlTypePermissionList').value;
      const addPerm = new AddPermanentPermission(obuCode, startDate, endDate, idAreasSelected, permissionTypeList);
      this.subscription.push(this.permissionService.addPermanentPermission(addPerm).subscribe({
        error: () => this.complete = true,
        complete: () => (this.snackBar.showMessage('permesso inserito', 'INFO'), this.complete = true)
      }));
    }
  }

  private getAreas(): void {
    const keyword = "";
    const isActive = true;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe((res) => {
      this.areas = res;
      this.areaFiltered = this.areas.slice();
    }));
  }

  private getPermissionType(): void {
    this.permissionTypeService.getPermissionType('', true).subscribe(
      (permission) => (
        this.permissionTypes = permission,
        this.permissionTypesFiltered = this.permissionTypes.slice()
      )
    );
  }

}
