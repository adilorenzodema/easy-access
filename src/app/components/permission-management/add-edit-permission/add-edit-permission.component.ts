import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AddDailyPermission, AddPermanentPermission, AddTemporaryPermission, Area, Park } from 'src/app/domain/class';
import { Category, Permission, PermissionType } from 'src/app/domain/interface';
import { PermissionManagementService } from 'src/app/service/permission-management.service';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styles: [
  ]
})
export class AddEditPermissionComponent implements OnInit {
  /**
   * Componente per l'aggiunta e la modifica di permessi
   */
  public formGroup: FormGroup;
  public parks: Park[] = [];
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
    private parkManagementService: ParkManagementService,
    private permissionTypeService: PermissionTypeManagementService,
    private translate: TranslateService
  ) {
    this.permission = this.router.getCurrentNavigation()?.extras.state?.['permission'] as Permission;
    this.daily = this.router.getCurrentNavigation()?.extras.state?.['daily'] as Boolean;
  }

  /*
   * Inizializza la barre di ricerca in base al tipo di permesso e a se è stato passato un permesso o no (così che distingue se fare add o edit)
  * */
  ngOnInit(): void {
    if (!this.permission && this.router.url === '/permission-management/edit-permission') { this.router.navigate(['/permission-management']); }

    this.getParks();

    if (this.permission) {
      const parksIdSelected: number[] = [];
      this.permission.parkList.map((park) => parksIdSelected.push(park.idPark));
      this.formGroup = this.formBuilder.group({
        ctrlCategory: [{ value: this.permission.category, disabled: true }, Validators.required],
        ctrlObu: [this.permission.obu.obuCode, [Validators.minLength(9), Validators.maxLength(19), Validators.pattern('[0-9]*'), Validators.required]],
        ctrlAreaIdList: [parksIdSelected, Validators.required],
        ctrlDateStart: [{ value: this.permission.validationDateStart, disabled: true }, Validators.required],
        ctrlDateEnd: [{ value: this.permission.validationDateEnd, disabled: true }, Validators.required],
      });
      if (this.permission.category === 'T') { // temporaneo
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

  /*
   * Cambia il form in base al tipo di categoria selezionato per il nuovo permesso (rimuove e aggiunge formControl)
  * */
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
      this.formGroup.addControl('ctrlHourEndDaily', this.formBuilder.control(moment('00:00:00', "hh:mm:ss").format("HH:mm"), Validators.required));
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

  /*
   * Crea o modifica un permesso
   * Effettua una chiamata diversa in base alla categoria di permesso
   *
  * */
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
    else if (categoryValue === 'D') { //daily
      const endDateD = startDate;
      const startHour = this.formGroup.get('ctrlHourStartDaily').value;
      const endHour = this.formGroup.get('ctrlHourEndDaily').value == "00:00"? "23:59:59" : this.formGroup.get('ctrlHourEndDaily').value;

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
    const endDateD:Date = this.formGroup.get('ctrlDateStart').value;

    this.formGroup.patchValue({ ctrlDateEnd: endDateD });
  }

  /**
   * Popola le select dei parcheggi associati all'utente
   */
  private getParks():void{

    this.subscription.push(this.parkManagementService.getAssociatedParksToUser().subscribe((res) => {
      this.parks = res;
    }));
  }

  /*
   * Popola select dei tipi di permesso
  * */
  private getPermissionType(): void {
    this.permissionTypeService.getPermissionType('', true).subscribe(
      (permission) => (
        this.permissionTypes = permission,
        this.permissionTypesFiltered = this.permissionTypes.slice()
      )
    );
  }

}
