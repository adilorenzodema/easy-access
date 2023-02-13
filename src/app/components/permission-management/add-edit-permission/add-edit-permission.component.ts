import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddPermanentPermission, AddTemporaryPermission, Area } from 'src/app/domain/class';
import { PermissionType } from 'src/app/domain/interface';
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

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionManagementService,
    private areaManagementService: AreaManagementService,
    private permissionTypeService: PermissionTypeManagementService
  ) { }

  ngOnInit(): void {
    this.getAreas();
    this.formGroup = this.formBuilder.group({
      ctrlCategory: ['', Validators.required],
      ctrlObu: ['', Validators.required],
      ctrlAreaIdList: ['', Validators.required],
      ctrlDateStart: ['', Validators.required],
      ctrlDateEnd: ['', Validators.required],
    });
  }

  public changeCategory(): void {
    const categoryValue = this.formGroup.get('ctrlCategory').value;
    if (categoryValue === 1) { // permanente
      this.formGroup.addControl('ctrlHourStart', this.formBuilder.control('', Validators.required));
      this.formGroup.addControl('ctrlHourEnd', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlTypePermissionList');
    } else if (categoryValue === 2) { // temporaneo
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
    const categoryValue = this.formGroup.get('ctrlCategory').value;
    const obuCode = this.formGroup.get('ctrlObu').value;
    const startDate = this.formGroup.get('ctrlDateStart').value;
    const endDate = this.formGroup.get('ctrlDateEnd').value;
    const idAreasSelected = this.formGroup.get('ctrlAreaIdList').value;
    if (categoryValue === 1) { // temporaneo
      const startHour = this.formGroup.get('ctrlHourStart').value;
      const endHour = this.formGroup.get('ctrlHourEnd').value;
      const addTemp = new AddTemporaryPermission(obuCode, startDate, endDate, idAreasSelected, startHour, endHour);
      this.subscription.push(this.permissionService.addTemporaryPermission(addTemp).subscribe(
        () => console.log('inserito')
      ));
    } else if (categoryValue === 2) { // permanente
      const permissionTypeList = this.formGroup.get('ctrlTypePermissionList').value;
      const addPerm = new AddPermanentPermission(obuCode, startDate, endDate, idAreasSelected, permissionTypeList);
      this.subscription.push(this.permissionService.addPermanentPermission(addPerm).subscribe(
        () => console.log('inserito')
      ));
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
    this.permissionTypeService.getPermissionType().subscribe(
      (permission) => (
        this.permissionTypes = permission,
        this.permissionTypesFiltered = this.permissionTypes.slice()
      )
    );
  }

}
