import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AddDailyPermission, AddPermanentPermission, AddTemporaryPermission, Area } from 'src/app/domain/class';
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
  public minDate = moment(this.today).toDate();
  public maxDate = moment(moment.now()).add(1, 'year').toDate();

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
      this.permission.areaList.map((area) => areasIdSelected.push(area.idArea));
      this.formGroup = this.formBuilder.group({
        ctrlCategory: [{ value: this.permission.category, disabled: true }, Validators.required],
        ctrlObu: [this.permission.obu.obuCode, [Validators.minLength(9), Validators.maxLength(19), Validators.pattern('[0-9]*'), Validators.required]],
        ctrlAreaIdList: [areasIdSelected, Validators.required],
        ctrlDateStart: [{ value: this.permission.validationDateStart, disabled: true }, Validators.required],
        ctrlDateEnd: [{ value: this.permission.validationDateEnd, disabled: true }, Validators.required],
      });
      if (this.permission.category === 'T') { // temporaneo
        console.log(this.permission);
        this.getPermissionType();
        this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control(this.permission.permissionType.permissionTypeId, Validators.required));
      } else if (this.permission.category === 'D') { //daily
        this.formGroup.addControl('ctrlHourStartDaily', this.formBuilder.control(moment(this.permission.startTime, 'hh:mm:ss').format('HH:mm'),
          Validators.required));
        this.formGroup.get('ctrlHourStartDaily')?.disable();
        this.formGroup.addControl('ctrlHourEndDaily', this.formBuilder.control(moment(this.permission.endTime, 'hh:mm:ss').format('HH:mm'),
          Validators.required));
        this.formGroup.get('ctrlHourEndDaily')?.disable();
      } else if (this.permission.category === 'P') { // permanente
        this.getPermissionType();
        /* this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control(this.permission.permissionType.permissionTypeId, Validators.required)); */
      }
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlCategory: ['', Validators.required],
        ctrlObu: ['', [Validators.minLength(9), Validators.maxLength(19), Validators.pattern('[0-9]*'), Validators.required]],
        ctrlAreaIdList: ['', Validators.required],
        ctrlDateStart: [moment(this.today).toDate(), Validators.required],
        ctrlDateEnd: [moment(this.today).toDate(), Validators.required],
      });
    }
  }

  public changeCategory(): void {
    const categoryValue: Category = this.formGroup.get('ctrlCategory').value;
    if (categoryValue === 'T') { // temporaneo
      if (this.permissionTypes.length === 0) { this.getPermissionType(); }
      this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlHourStart');
      this.formGroup.removeControl('ctrlHourEnd');
      this.formGroup.removeControl('ctrlHourStartDaily');
      this.formGroup.removeControl('ctrlHourEndDaily');
      this.formGroup.addControl('ctrlDateEnd', this.formBuilder.control('', Validators.required));
      this.formGroup.patchValue({ ctrlDateEnd: moment(this.today).add(5, 'days').toDate() });
    } else if (categoryValue === 'D') { //giornaliero
      /* const hour = moment().hour();
      const minutes = moment().minutes();
      const HM = hour + ':' + minutes; */
      this.formGroup.addControl('ctrlDateEnd', this.formBuilder.control('', Validators.required));
      this.formGroup.patchValue({ ctrlDateStart: moment(this.today).toDate() });
      this.formGroup.patchValue({ ctrlDateEnd: moment(this.today).toDate() });
      this.formGroup.removeControl('ctrlHourStart');
      this.formGroup.removeControl('ctrlHourEnd');
      this.formGroup.addControl('ctrlHourStartDaily', this.formBuilder.control(moment("00:00:00", "HH:mm").format("HH:mm"), Validators.required));
      this.formGroup.addControl('ctrlHourEndDaily', this.formBuilder.control(moment('23:55:59', "hh:mm:ss").format("HH:mm"), Validators.required));
      this.formGroup.removeControl('ctrlTypePermissionList');
    } else if (categoryValue === 'P') { // permanente
      /*  if (this.permissionTypes.length === 0) { this.getPermissionType(); }
        this.formGroup.addControl('ctrlTypePermissionList', this.formBuilder.control('', Validators.required));  */
      this.formGroup.removeControl('ctrlTypePermissionList');
      this.formGroup.removeControl('ctrlHourStart');
      this.formGroup.removeControl('ctrlHourEnd');
      this.formGroup.removeControl('ctrlHourStartDaily');
      this.formGroup.removeControl('ctrlHourEndDaily');
      this.formGroup.removeControl('ctrlDateEnd');
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
    const idAreasSelected = this.formGroup.get('ctrlAreaIdList').value;

    if (categoryValue === 'T') { // temporaneo
      const endDate = this.formGroup.get('ctrlDateEnd').value;
      const permissionTypeList = this.formGroup.get('ctrlTypePermissionList').value;
      const addTemp = new AddTemporaryPermission(obuCode, startDate, endDate, idAreasSelected,permissionTypeList );
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
    }
    else if (categoryValue === 'P') { // permanente
      const endDateP = moment("2999-12-31").toDate();
      const addPerm = new AddPermanentPermission(obuCode, startDate, endDateP, idAreasSelected);
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
    else if (categoryValue === 'D') {
      const endDateD = this.formGroup.get('ctrlDateStart').value;
      const startHour = this.formGroup.get('ctrlHourStartDaily').value;
      const endHour = this.formGroup.get('ctrlHourEndDaily').value;
      const addDaily = new AddDailyPermission(obuCode, startDate, endDateD, idAreasSelected, startHour, endHour);
      if (this.permission) { // edit
        this.subscription.push(this.permissionService.editDailyPermission(addDaily, this.permission.idPermission).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionEdited'),
            'INFO'), this.router.navigate(['/permission-management']), this.complete = true)
        }));
      } else { // add
        this.subscription.push(this.permissionService.addDailyPermission(addDaily).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionAdded')
            , 'INFO'), this.router.navigate(['/permission-management']), this.complete = true)
        }));
      }
    }
  }

  public setDateEnd(): void{
    const endDateD = this.formGroup.get('ctrlDateStart').value;
    this.formGroup.patchValue({ ctrlDateEnd: endDateD });
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
