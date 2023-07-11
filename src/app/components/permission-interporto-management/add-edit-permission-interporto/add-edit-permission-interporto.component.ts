import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DemaCompanyManagementService } from 'dema-company-management';
import { AuthService, PagePermissionService, SnackBar } from 'dema-movyon-template';
import { Operation, Parametro } from 'dema-movyon-template/lib/components/domain/interface';
import * as moment from 'moment';
import { Subscription, forkJoin } from 'rxjs';
import { AddDailyPermissionInterporto, AddPermanentPermissionInterporto, AddTemporaryPermissionInterporto, Park } from 'src/app/domain/class';
import { Category, PermissionInterporto, PermissionType } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { PermissionInterportoManagementService } from 'src/app/service/permission-interporto-management.service';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';
import { Company } from "dema-company-management/lib/domain/class";

@Component({
  selector: 'app-add-edit-permission-interporto',
  templateUrl: './add-edit-permission-interporto.component.html',
  styleUrls: []
})
export class AddEditPermissionInterportoComponent implements OnInit {

  public formGroup: FormGroup;
  public parks: Park[] = [];
  public companies: Company[] = [];
  public permissionTypes: PermissionType[] = [];
  public permissionTypesFiltered: PermissionType[] = [];
  public permission: PermissionInterporto;
  public complete = true;
  public daily: Boolean;
  public today = moment(moment.now());
  public minDate = moment(this.today).toDate();
  public maxDate = moment(moment.now()).add(1, 'year').toDate();
  public tipoInserimento = "obu";
  public operations: Operation[] = [];
  private subscription: Subscription[] = [];
  private parametro : Parametro;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: SnackBar,
    private pagePermissionService: PagePermissionService,
    private permissionInterportoService: PermissionInterportoManagementService,
    private parkManagementService: ParkManagementService,
    private permissionTypeService: PermissionTypeManagementService,
    private companiesService: DemaCompanyManagementService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.permission = this.router.getCurrentNavigation()?.extras.state?.['permission'] as PermissionInterporto;
    this.daily = this.router.getCurrentNavigation()?.extras.state?.['daily'] as Boolean;
    this.operations = this.router.getCurrentNavigation()?.extras.state?.['operations'] as Operation[];
  }

  ngOnInit(): void {
    if (!this.permission && this.router.url === '/permission-management/edit-permission-interporto') { this.router.navigate(['/permission-interporto-management']); }
    this.getParksAndCompanies();
    if (this.permission){
      const parksIdSelected: number[] = [];
      this.permission.parkList.map((park) => parksIdSelected.push(park.idPark));
      this.formGroup = this.formBuilder.group({
        ctrlCategory: [{ value: this.permission.category, disabled: true }, Validators.required],
        ctrlObu: [{value: this.permission.obu?.obuCode, disabled: true}, [Validators.minLength(9), Validators.maxLength(19), Validators.pattern('[0-9]*'), Validators.required]],
        ctrlPlate: [{value: this.permission.targa, disabled: true} , [Validators.required]], //regex per la targa???
        ctrlParkIdList: [parksIdSelected, Validators.required],
        ctrlCompanyList: [{ value: this.permission.azienda.companyId , disabled: true }, Validators.required ],
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
      (this.permission.obu?.obuCode) ? this.tipoInserimento = "obu" : this.tipoInserimento = "targa";
    } else {
      this.formGroup = this.formBuilder.group({
        ctrlCategory: ['', Validators.required],
        ctrlObu: ['', [Validators.minLength(9), Validators.maxLength(19), Validators.pattern('[0-9]*'), Validators.required]],
        ctrlPlate: ['', [Validators.required]], //regex per la targa???
        ctrlParkIdList: ['', Validators.required],
        ctrlCompanyList: ['', Validators.required ],
        ctrlDateStart: [moment(this.today).toDate(), Validators.required],
        ctrlDateEnd: [moment(this.today).toDate(), Validators.required],
      });
    }
  }

  ngAfterViewInit(): void {
    //this.getPermissionAPI();
    this.setDateEnd();
  }

  changeSelect(event:MatSelectChange){
    this.tipoInserimento = event.value;

    if (this.tipoInserimento == 'obu'){
      this.formGroup.addControl('ctrlObu', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlPlate');
    }

    if (this.tipoInserimento == 'targa'){
      this.formGroup.addControl('ctrlPlate', this.formBuilder.control('', Validators.required));
      this.formGroup.removeControl('ctrlObu');
    }

   /*  if (this.tipoInserimento == 'all') {
      this.formGroup.addControl('ctrlObu', this.formBuilder.control('', Validators.required));
      this.formGroup.addControl('ctrlPlate', this.formBuilder.control('', Validators.required));
    } */
  }

  changeCategory():void{
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

  /*
   * Crea o modifica un permesso
   * Effettua una chiamata diversa in base alla categoria di permesso
   *
  * */

  //Cambiare interfaccie e servizi
  public addEditPermission(): void { 
    this.complete = false;
    const categoryValue: Category = this.formGroup.get('ctrlCategory').value;
    //settare null se vuote
    const obuCode = (this.formGroup.get('ctrlObu')) ?  this.formGroup.get('ctrlObu').value : null;
    const plate = (this.formGroup.get('ctrlPlate')) ? this.formGroup.get('ctrlPlate').value : "";
    const startDate = this.formGroup.get('ctrlDateStart').value;
    const idAreasSelected = this.formGroup.get('ctrlParkIdList').value;
    const companyId = this.formGroup.get('ctrlCompanyList').value;
    if (categoryValue === 'T') { // temporaneo
      const endDate = this.formGroup.get('ctrlDateEnd').value;
      const permissionTypeList = this.formGroup.get('ctrlTypePermissionList').value;
      const addTemp = new AddTemporaryPermissionInterporto(startDate, endDate, idAreasSelected, companyId,permissionTypeList, obuCode, plate );
      if (this.permission) { // edit
         this.subscription.push(this.permissionInterportoService.editTemporaryPermission(addTemp, this.permission.idPermission).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionEdited'),
            'INFO'), this.router.navigate(['/permission-interporto-management']), this.complete = true)
        })); 
      } else { // add
        this.subscription.push(this.permissionInterportoService.addTemporaryPermission(addTemp).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionAdded')
            , 'INFO'), this.router.navigate(['/permission-interporto-management']), this.complete = true)
        }));
      }
    }
    else if (categoryValue === 'P') { // permanente
      const endDateP = moment("2999-12-31").toDate();
      const addPerm = new AddPermanentPermissionInterporto(startDate, endDateP, idAreasSelected,  companyId,obuCode, plate);
      if (this.permission) { // edit
         this.subscription.push(this.permissionInterportoService.editPermanentPermission(addPerm, this.permission.idPermission).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionEdited'),
            'INFO'), this.router.navigate(['/permission-interporto-management']), this.complete = true)
        })); 
      } else { // add
        this.subscription.push(this.permissionInterportoService.addPermanentPermission(addPerm).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionAdded')
            , 'INFO'), this.router.navigate(['/permission-interporto-management']), this.complete = true)
        }));
      }
    }
    else if (categoryValue === 'D') { //daily
      const endDateD = startDate;
      const startHour = this.formGroup.get('ctrlHourStartDaily').value;
      const endHour = this.formGroup.get('ctrlHourEndDaily').value == "00:00"? "23:59:59" : this.formGroup.get('ctrlHourEndDaily').value;

      const addDaily = new AddDailyPermissionInterporto(startDate, endDateD, idAreasSelected, companyId, startHour, endHour, obuCode, plate);
      if (this.permission) { // edit
         this.subscription.push(this.permissionInterportoService.editDailyPermission(addDaily, this.permission.idPermission).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionEdited'),
            'INFO'), this.router.navigate(['/permission-interporto-management']), this.complete = true)
        })); 
      } else { // add
        this.subscription.push(this.permissionInterportoService.addDailyPermission(addDaily).subscribe({
          error: () => this.complete = true,
          complete: () => (this.snackBar.showMessage(this.translate.instant('manage-permission.permissionAdded')
            , 'INFO'), this.router.navigate(['/permission-interporto-management']), this.complete = true)
        }));
      }
    }
  }

  public setDateEnd(): void{
    this.authService.getAllParameters().subscribe({
      next: ( parametro ) => {
        console.log(parametro);
        parametro.forEach(element => {
          if (element.codiceParametro === 'PERMISSION_MAX_END_DATE') {
            this.maxDate = moment(moment.now()).add(element.valoreParametro, 'days').toDate();
            console.log(this.maxDate);
          }
        })
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
    const endDateD:Date = this.formGroup.get('ctrlDateStart').value;
    this.formGroup.patchValue({ ctrlDateEnd: endDateD });
  }

  public getParksAndCompanies(): void {
    this.complete = false;
    this.subscription.push(forkJoin({
      parks: this.parkManagementService.getAssociatedParksToUser(),
      companies: this.companiesService.getManageableCompanies("", true)
    }).subscribe({
      next: ({ parks, companies }) => {
        this.parks = parks;
        this.companies = companies;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
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

  /**
    * Ritorna le operazioni disponibili all'utente nella pagina attuale in base al tipo del profilo.
  */
  private getPermissionAPI(): void {
    const currentUrl = (window.location.hash).replace('#/', '');
    this.subscription.push(this.pagePermissionService.getPermissionPage(currentUrl).subscribe(
      permission => {
        this.operations = permission.operations;
      },
    ));
  }

}
