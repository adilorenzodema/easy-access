import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
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
  public daily: Boolean;
  public today = moment(moment.now());

  private subscription: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: SnackBar,
    private permissionService: PermissionManagementService,
    private areaManagementService: AreaManagementService,
    private permissionTypeService: PermissionTypeManagementService,
    private translate: TranslateService
  ) {
    this.permission = this.router.getCurrentNavigation()?.extras.state?.['permission'] as Permission;
    this.daily = this.router.getCurrentNavigation()?.extras.state?.['daily'] as Boolean;
  }

  ngOnInit(): void {
    if (!this.permission && this.router.url === '/permission-management/edit-permission') { this.router.navigate(['/permission-management']); }
    this.getAreas();
    if (this.permission) {
      const areasIdSelected: number[] = [];
      console.log(this.permission);
      this.permission.areaList.map((area) => areasIdSelected.push(area.idArea));
      this.formGroup = this.formBuilder.group({
        ctrlCategory: [{ value: this.permission.category, disabled : true },Validators.required],
        ctrlObu: [this.permission.obu.obuCode, Validators.required],
        ctrlAreaIdList: [areasIdSelected, Validators.required],
        ctrlDateStart: [this.permission.validationDateStart, Validators.required],
        ctrlDateEnd: [this.permission.validationDateEnd, Validators.required],
      });
      if (this.permission.category === 'T' || this.permission.category === 'D') { // temporaneo
        this.formGroup.addControl('ctrlHourStart', this.formBuilder.control(moment(this.permission.startTime, 'hh:mm:ss').format('HH:mm'), Validators.required));
        this.formGroup.addControl('ctrlHourEnd', this.formBuilder.control(moment(this.permission.endTime, 'hh:mm:ss').format('HH:mm'), Validators.required));
      } else if (this.permission.category === 'P') { // permanente
        this.getPermissionType();
        this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control(this.permission.permissionType.permissionTypeId, Validators.required));
      }
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlCategory: ['', Validators.required],
        ctrlObu: ['', Validators.required],
        ctrlAreaIdList: ['', Validators.required],
        ctrlDateStart: [moment(this.today).toDate(), Validators.required],
        ctrlDateEnd: [ moment(this.today).toDate(),Validators.required],
      });
    }
  }

  public changeCategory(): void {
    const categoryValue: Category = this.formGroup.get('ctrlCategory').value;
    if (categoryValue === 'T') { // temporaneo
      this.formGroup.removeControl('ctrlHourStart');
      this.formGroup.removeControl('ctrlHourEnd');
      this.formGroup.addControl('ctrlHourStart', this.formBuilder.control('', Validators.required));
      this.formGroup.addControl('ctrlHourEnd', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlTypePermissionList');
    } else if (categoryValue === 'D' ) { //giornaliero
      const currentDate = new Date;
      this.formGroup.patchValue({ctrlDateStart: moment(this.today).toDate()});
      this.formGroup.patchValue({ctrlDateEnd: moment(this.today).toDate()});
      this.formGroup.removeControl('ctrlHourStart');
      this.formGroup.removeControl('ctrlHourEnd');
      this.formGroup.addControl('ctrlHourStart', this.formBuilder.control(moment(currentDate, 'hh:mm:ss').format('HH:mm'), Validators.required));
      this.formGroup.addControl('ctrlHourEnd', this.formBuilder.control( moment( "23:59:00", "hh:mm:ss").format("HH:mm"), Validators.required));
      this.formGroup.removeControl('ctrlTypePermissionList');
    } else if (categoryValue === 'P' ) { // permanente
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

  public addEditPermission(): void {
    this.complete = false;
    const categoryValue: Category = this.formGroup.get('ctrlCategory').value;
    const obuCode = this.formGroup.get('ctrlObu').value;
    const startDate = this.formGroup.get('ctrlDateStart').value;
    const endDate = this.formGroup.get('ctrlDateEnd').value;
    const idAreasSelected = this.formGroup.get('ctrlAreaIdList').value;
    if (categoryValue === 'T' || categoryValue === 'D' ) { // temporaneo
      const startHour = this.formGroup.get('ctrlHourStart').value;
      const endHour = this.formGroup.get('ctrlHourEnd').value;
      const addTemp = new AddTemporaryPermission(obuCode, startDate, endDate, idAreasSelected, startHour, endHour);
      if (this.permission) { // edit
        this.subscription.push(this.permissionService.editTemporaryPermission(addTemp, this.permission.idPermission).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionEdited'),
            'INFO'), this.router.navigate(['/permission-management']), this.complete = true)
        }));
      } else { // add
        this.subscription.push(this.permissionService.addTemporaryPermission(addTemp).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionAdded')
            , 'INFO'), this.router.navigate(['/permission-management']), this.complete = true)
        }));
      }
    } else if (categoryValue === 'P') { // permanente
      const permissionTypeList = this.formGroup.get('ctrlTypePermissionList').value;
      const addPerm = new AddPermanentPermission(obuCode, startDate, endDate, idAreasSelected, permissionTypeList);
      if (this.permission) { // edit
        this.subscription.push(this.permissionService.editPermanentPermission(addPerm, this.permission.idPermission).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionEdited'),
            'INFO'), this.router.navigate(['/permission-management']), this.complete = true)
        }));
      } else { // add
        this.subscription.push(this.permissionService.addPermanentPermission(addPerm).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionAdded')
            , 'INFO'), this.router.navigate(['/permission-management']), this.complete = true)
        }));
      }
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


//eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOSIsImlhdCI6MTY3ODQ0MTA3NywiZXhwIjoxNjc4NDQxNjc3fQ.XU8I-MkyVkq3EMomQUapwWWzObiWaPZN7m2Th6WQIDE
