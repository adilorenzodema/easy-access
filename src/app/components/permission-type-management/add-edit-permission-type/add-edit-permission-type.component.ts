import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { AddEditTypePermission } from 'src/app/domain/class';
import { PermissionType } from 'src/app/domain/interface';
import { PermissionTypeManagementService } from 'src/app/service/permission-type-management.service';

@Component({
  selector: 'app-add-edit-permission-type',
  templateUrl: './add-edit-permission-type.component.html',
  styles: [`
  .timeSlot {
    width: 60%;
    border: 2px solid  #283c74;
    border-radius: 10px;
    padding: 2%;
    margin: 1%;
  }
  `
  ]
})
export class AddEditPermissionTypeComponent implements OnInit {
  /**
   * Componente per l'aggiunta e la modifica di permessi
   */

  public formGroup: FormGroup;
  public days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  public holidays = ['holiday'];
  public viewMode = true;
  public complete = true;
  public permissionType: PermissionType;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private permissionTypeService: PermissionTypeManagementService,
    private router: Router,
    private translate: TranslateService
  ) { this.permissionType = this.router.getCurrentNavigation()?.extras.state?.['permissionType'] as PermissionType; }

  /**
   * Ritorna l'array di fasce orarie del tipo di permesso
   */
  get timesSlot(): FormArray {
    return this.formGroup.get('ctrlTimesSlot') as FormArray;
  }

  /*
   * Inizializza la barre di ricerca in base al tipo di permesso e a se è stato passato un permesso o no (così che distingue se fare add o edit)
  * */
  ngOnInit(): void {
    if (!this.permissionType && this.router.url === '/permission-type-management/edit-permission-type') { this.router.navigate(['/permission-type-management']); }
    if (this.permissionType) {
      this.formGroup = this.formBuilder.group({
        ctrlName: [this.permissionType.permissionTypeDesc, Validators.required],
        ctrlTimesSlot: this.formBuilder.array(this.buildExistingTimeSlotArray()),
      });
    }
    else {
      this.formGroup = this.formBuilder.group({
        ctrlName: ['', Validators.required],
        ctrlTimesSlot: this.formBuilder.array([this.buildTimeSlotArray()]),
      });
    }
  }

  /*
   * Crea o modifica un tipo di permesso
   * se la variabile permissionType è undefined si tratta di una add, altrimenti è una edit
  * */
  public addEditPermissionType(): void {
    this.complete = false;
    if (this.permissionType) {
      const name = this.formGroup.get('ctrlName').value;
      const list = this.formGroup.get('ctrlTimesSlot').value;
      const editPermissionType = new AddEditTypePermission(name, list, this.permissionType.permissionTypeId);
      this.permissionTypeService.editPermissionType(editPermissionType).subscribe({
        error: () => this.complete = true,
        complete: () => (
          this.snackBar.showMessage(this.translate.instant('manage_permission_type.permissionEdited'), 'INFO'),
          this.router.navigate(['/permission-type-management']), this.complete = true)
      });
    }
    else {
      const name = this.formGroup.get('ctrlName').value;
      const list = this.formGroup.get('ctrlTimesSlot').value;
      const addPermissionType = new AddEditTypePermission(name, list);
      this.permissionTypeService.addPermissionType(addPermissionType).subscribe({
        error: () => this.complete = true,
        complete: () => (
          this.snackBar.showMessage(this.translate.instant('manage_permission_type.permissionAdded'), 'INFO'),
          this.router.navigate(['/permission-type-management']), this.complete = true)
      });
    }
  }

  /**
   * Aggiunge una nuova fascia oraria (creazione nuovo form per una fascia oraria aggiuntiva al tipo di permeeso)
   */
  public addTimeSlot(): void {
    this.timesSlot.push(this.buildTimeSlotArray());
  }

  /*
   * Rimozione delle fasce orarie
  * */
  public removeTimeSlot(index: number): void {
    this.timesSlot.removeAt(index);
  }

  /*
   * creazione formGroup per i checkbox della scelta dei giorni e la scelta dell'orario
   * per l'inserimento di un nuovo tipo di permesso
  * */
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
    });
  }

  /*
   * creazione formGroup per i checkbox della scelta dei giorni e la scelta dell'orario
   * per la modifica di un tipo di permesso
  * */
  public buildExistingTimeSlotArray(): FormGroup[] {
    const formGroupArray: FormGroup[] = [];
    this.permissionType.timeslotList.forEach(timeSlot => {
      formGroupArray.push(this.formBuilder.group(
        {
          startTime: [moment(timeSlot.startTime, 'hh:mm:ss').format('HH:mm'), Validators.required],
          endTime: [moment(timeSlot.endTime, 'hh:mm:ss').format('HH:mm'), Validators.required],
          monday: [timeSlot.monday],
          tuesday: [timeSlot.tuesday],
          wednesday: [timeSlot.wednesday],
          thursday: [timeSlot.thursday],
          friday: [timeSlot.friday],
          saturday: [timeSlot.saturday],
          sunday: [timeSlot.sunday],
          holiday: [timeSlot.holiday],
        }));
    });
    return formGroupArray;
  }
}
