import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { forkJoin, Subscription } from 'rxjs';
import { Area } from 'src/app/domain/class';
import { ParkAssociated, UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.css']
})
export class EditAreaComponent implements OnInit, OnDestroy {
  /**
     *Gestione della pagina /#/area-management/edit-area
     */
  public area: Area;
  public formGroup: FormGroup;
  public users: UserAssociated[] = [];
  public assParks: ParkAssociated[] = [];
  /**
     *Variabile che gestisce se la pagina è in modalità visualizzazione(true) o modifica(false).
     */
  public viewModeUser = true;
  public complete = true;

  private subscription: Subscription[] = [];
  /**
       *Costruttore. 
       *Assegna alla variabile area, i valori passati dal bottone edit-area in /#/area-management.
       *In caso essi non siano presenti, rimanda l'utente a /#/area-management.
       */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private areaManageService: AreaManagementService,
    private translate: TranslateService
  ) {
    this.area = this.router.getCurrentNavigation()?.extras.state?.['area'] as Area;
    if (!this.area) { this.router.navigate(['/area-management']); }
  }
  /**
         *Inizializza il formGroup (formGroup) con le rispettive proprietà e controlli associati.
         *Poi popola i sottocomponenti table-associated-park e table-associated-user con i valori ritornati dalla apiGetAssociation().
         *ctrlAreaName - textbox che contiene il nome dell'Area, accetta solo lettere e spazi.
         *ctrlCreationDate - textbox che contiene la creationDate dell'Area. Non editabile.
         *ctrlSearch - barra di ricerca per utenti/parcheggi associati.
         */
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlAreaName: [this.area.areaName, Validators.required],
      ctrlCreationDate: [moment(this.area.creationDate).format('DD/mm/YYYY')],
      ctrlSearch: ['']
    });
    this.apiGetAssociation();
  }

  /**
     *Quando viene distrutto il componente, cancella tutte le sottoscrizioni agli Observable.
     */
  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   *Ritorna due liste di oggetti, una di tipo UserAssociated per gli utenti e l'altra di tipo ParkAssociated per i parcheggi.
   *Le due liste vengono poi usate per popolare le rispettive tabelle.
     */
  public apiGetAssociation(): void {
    this.complete = false;
    this.subscription.push(forkJoin({
      assUsers: this.areaManageService.getAssociateUserArea(this.area.idArea),
      assParks: this.areaManageService.getAssociateParkArea(this.area.idArea)
    }).subscribe({
      next: ({ assUsers, assParks }) => {
        this.assParks = assParks;
        this.users = assUsers;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /**
      *Modifica un'Area, richiamando la funzione editArea() del servizio area-management, passandogli i valori inseriti dall'utente.
      *In caso di successo o errore, genera una snackbar con l'appropriato messaggio.
       */
  public saveDetails(): void {
    const areaName = this.formGroup.get('ctrlAreaName').value;
    const editArea = new Area(areaName, this.area.idArea);
    this.subscription.push(this.areaManageService.editArea(editArea).subscribe({
      next: () => this.snackBar.showMessage(this.translate.instant('manage_areas.editSnackBar'), 'INFO'),
      complete: () => this.getAreaById()
    }));
  }

  /**
   *Ritorna l'intero oggetto Area in base al suo ID.
     */
  private getAreaById(): void {
    this.subscription.push(this.areaManageService.getAreaByIdArea(this.area.idArea).subscribe(
      (respArea) => this.area = respArea
    ));
  }
}
