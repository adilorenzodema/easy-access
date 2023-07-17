import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public editable = false;
  public maxStartTime : string;
  public minEndTime : string;


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
    //console.log(this.formGroup);
  }

  // ngDoCheck(): void {
  //   console.log(this.timesSlot);
  // }

  /*
   * Crea o modifica un tipo di permesso
   * se la variabile permissionType è undefined si tratta di una add, altrimenti è una edit
  * */
  public addEditPermissionType(): void {
    //controllo che i 2 orari combacino e che entrambi siano 00:00
    const list = this.formGroup.get('ctrlTimesSlot').value;
    for (let i = 0; i < list.length; i++) {
      if(list[i].startTime === list[i].endTime && list[i].startTime === '00:00') {
        list[i].endTime = '23:59';
      }
    }
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

  /*
   * Aggiunge una nuova fascia oraria (creazione nuovo form per una fascia oraria aggiuntiva al tipo di permesso)
   * */
  public addTimeSlot(): void {
    this.timesSlot.push(this.buildTimeSlotArray());
    if(this.timesSlot.length > 0){
      this.editable = false;
    }
  }

  /*
   * Rimozione delle fasce orarie
  * */
  public removeTimeSlot(index: number): void {
    if(this.timesSlot.length > 1){
      this.timesSlot.removeAt(index);
      this.editable = true;
    }
  }

 /*
  * Configurazione del valore massimo di startTime o minimo per endTime
  * Selezionando EndTime => startTime [max]=endTime - 30 minuti
  * Selezionando startTime => endTime [min]=startTime + 30 minuti  
  * orari che combaciano a 00:00 allora imposto endTime = 23:59  
 */
  setMaxTimeChanged(index: number, event: any) : void{
    const list = this.formGroup.get('ctrlTimesSlot').value;
    //split su event sui : esempio ["13", "00"]
    //se 2 valore 00 aggioungo 30 min
    //se 2 valore 30: aggiungo +1 (se 23:30 allora diventa 00:00) al 1 valore e set min a 00
    let stringTime = event.split(':');
    if(stringTime[1] === '00'){
      stringTime[1] = '30';
    } else if(stringTime[1] === '30'){
      stringTime[0] = (+stringTime[0] + 1).toString();
      stringTime[1] = '00';
    }
    this.minEndTime = stringTime[0] + ':' + stringTime[1];
    list[index].startTime = this.minEndTime;
  }

  setMinTimeChanged(index: number, event: any) : void{  
    const list = this.formGroup.get('ctrlTimesSlot').value;
    //split su event sui : esempio ["13", "00"]
    //se 2 valore 00: settare valore 2 a 30 e -1 a valore 1  
    //se 2 valore 30: settare valore 2 a 00    
    let stringTime = event.split(':');
    if(stringTime[1] === '00'){
      stringTime[1] = '30';
      stringTime[0] = (+stringTime[0] - 1).toString();
    } else if(stringTime[1] === '30'){
      stringTime[1] = '00';
    }
    // console.log(stringTime);
    this.maxStartTime = stringTime[0] + ':' + stringTime[1];
    list[index].endTime = this.maxStartTime;
  }
  
    /*
    * Controllo se startTime è sempre infeririore endTime partendo dal ctrlTimesSlot
    * */
//  public isStartTimeAfterEndTime(): boolean {
//   let error = false;
//   const list = this.formGroup.get('ctrlTimesSlot').value;
//   for (let i = 0; i < list.length; i++) {
//     console.log(list[i]);
//     const startTime = list[i].startTime; 
//     const endTime = list[i].endTime;
//     console.log(startTime);
//     console.log(endTime);
//     if (moment(startTime).isAfter(endTime)){
//       error = true;
//       console.log(error);
//       } else {
//         error = false;
//         console.log(error);
//       }
//     }
//     return error;
//   }

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


