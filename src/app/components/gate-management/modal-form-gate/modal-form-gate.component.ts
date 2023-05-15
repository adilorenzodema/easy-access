import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AddEditGate, Park } from 'src/app/domain/class';
import { Gate } from 'src/app/domain/interface';
import { GateService } from 'src/app/service/gate-management.service';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { DIRECTION } from 'src/app/shared/costants/constants';


@Component({
  selector: 'app-modal-form-gate',
  templateUrl: './modal-form-gate.component.html',
  styles: ['']
})
export class ModalFormGateComponent implements OnInit, OnDestroy {
  /*
   * *Gestione della modale per l'aggiunta o la modifica di un varco
   */
  public inputUserForm: FormGroup;
  public parks: Park[] = [];
  //DIRECTION è una costante creata ad-hoc causa specifiche progettuali
  public direction = DIRECTION;
  private subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormGateComponent>,
    private formBuilder: FormBuilder,
    private gateService: GateService,
    private parkService: ParkManagementService,
    private snackBar: SnackBar,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Gate
  ) { }

  /*
  *Vengono presi e salvati nella variabile parks tutti i parcheggi attivi ed accessibili all'utente. Ci serviranno poi per popolare la rispettiva dropdown
  *In base alla presenza o no di un varco, la modale viene inizializzata per l'aggiunta di un nuovo varco o per la modifica di un varco esistente
  */
  ngOnInit(): void {
    this.subscription.push(this.parkService.getParking('', true, null).subscribe(
      (respParks) => this.parks = respParks
    ));
    //Se data esiste (quindi === true), allora siamo nella modifica, altrimenti nell'aggiunta
    if (this.data) {
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [this.data.gateDescription, [Validators.required, /* Validators.pattern('^[a-zA-Z0-9_.- ]*$')] */]],
        ctrlGateDirection: [this.data.gateDirection, [Validators.required]],
        ctrlIpAntenna: [this.data.ipAntenna, [Validators.required,
          Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]],
        ctrlPortAntenna: [this.data.portAntenna, [Validators.required, Validators.pattern('^[0-9]*$')]],
        ctrlCodeAntenna: [this.data.codeAntenna, [Validators.required]],
        ctrlParkId: [this.data.park?.idPark, Validators.required]
      });
    } else {
      this.inputUserForm = this.formBuilder.group({
        ctrlGateName: [null, [Validators.required, /* Validators.pattern('^[a-zA-Z0-9_.- ]*$') */]],
        ctrlParkId: [null, Validators.required],
        ctrlGateDirection: [null, [Validators.required]],
        ctrlIpAntenna: [null, [Validators.required,
          Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]],
        ctrlPortAntenna: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
        ctrlCodeAntenna: [null, Validators.required]
      });
    }
  }

   /**
   *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
   */
  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

  /**
   *Crea la variabile formGateAdd popolata con i dati inseriti dall'utente nel form.
   *Poi richiaman la funzione addGate() o editGate() del servizio gate-management, passandogli in input la variabile formGateAdd.
   *In caso di successo o errore, genera una snackbar con l'appropriato messaggio.
   *@param idAdd - Stabilisce se si sta aggiungendo un varco o se si sta modificando un varco.
   */
  public onSubmit(isAdd: boolean): void {
    if (isAdd) {
      const gateName = this.inputUserForm.get('ctrlGateName')?.value;
      const parkId = this.inputUserForm.get('ctrlParkId')?.value;
      const gateDirection = this.inputUserForm.get('ctrlGateDirection')?.value;
      const ipAntenna = this.inputUserForm.get('ctrlIpAntenna')?.value;
      const portAntenna = this.inputUserForm.get('ctrlPortAntenna')?.value;
      const codeAntenna = this.inputUserForm.get('ctrlCodeAntenna')?.value;
      const formGateAdd = new AddEditGate(parkId, gateName, gateDirection, ipAntenna, portAntenna, codeAntenna);
      this.subscription.push(this.gateService.addGate(formGateAdd).subscribe({
        next: () => {
          this.snackBar.showMessage(this.translate.instant('manage_gates.insertGate'), 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      }));
    } else {
      const idGate = this.data.idGate;
      const gateName = this.inputUserForm.get('ctrlGateName')?.value;
      const parkId = this.inputUserForm.get('ctrlParkId')?.value;
      const gateDirection = this.inputUserForm.get('ctrlGateDirection')?.value;
      const ipAntenna = this.inputUserForm.get('ctrlIpAntenna')?.value;
      const portAntenna = this.inputUserForm.get('ctrlPortAntenna')?.value;
      const codeAntenna = this.inputUserForm.get('ctrlCodeAntenna')?.value;
      const formGateAdd = new AddEditGate(parkId, gateName, gateDirection, ipAntenna, portAntenna, codeAntenna);
      formGateAdd.idGate = idGate;
      this.subscription.push(this.gateService.editGate(formGateAdd).subscribe({
        next: () => {
          this.snackBar.showMessage(this.translate.instant('manage_gates.editGate'), 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      }));
    }
  }

}







