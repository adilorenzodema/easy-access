
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { Area } from 'src/app/domain/class';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-modal-form-area',
  templateUrl: './modal-form-area.component.html',
  styleUrls: ['./modal-form-area.component.css']
})
export class ModalFormAreaComponent implements OnInit, OnDestroy {
  /**
       *Gestione della finestra modale per l'aggiunta di un'Area.
       */
  public inputUserForm: FormGroup;
  private subscription: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalFormAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Area,
    private formBuilder: FormBuilder,
    private areaManagementService: AreaManagementService,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) { }
  /**
       *Inizializza il formGroup (inputUserForm) con le ripettive proprietà è controlli associati
       *ctrlAreaName - proprietà di inputUserForm, textbox che accetta solo lettere e spazi.
       */
  ngOnInit(): void {
    if (this.data.idArea) {
      this.inputUserForm = this.formBuilder.group({
        ctrlAreaName: [this.data.areaName, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      });
    } else {
      this.inputUserForm = this.formBuilder.group({
        ctrlAreaName: ['', [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
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
   *La gestione della modifica di un'Area è gestita da un'altro componente.
   *Aggiunge un'Area, richiamando la funzione addArea() del servizio area-management, passandogli l'Area inserita dall'utente.
   *In caso di successo o errore, genera una snackbar con l'appropriato messaggio.
   *@param idAdd - Stabilisce se si sta aggiungendo un'Area o se si sta modificando un'Area. (DEPRECATA)
   */
  public onSubmit(isAdd: boolean): void {
    const name = this.inputUserForm.get('ctrlAreaName')?.value;
    const formAreaAdd = new Area(name);
    if (isAdd) {
      this.areaManagementService.addArea(formAreaAdd).subscribe({
        next: (data: Area) => {
          this.snackBar.showMessage(this.translate.instant('manage_areas.areaInsert'), 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      });
    } else {
      const idArea = this.data.idArea;
      const formAreaEdit = new Area(name, idArea);
      this.areaManagementService.editArea(formAreaEdit).subscribe({
        next: (data: Area) => {
          this.snackBar.showMessage(this.translate.instant('manage_areas.areaEdit'), 'INFO');
        },
        complete: () => this.dialogRef.close(true)
      });
    }
  }

}





