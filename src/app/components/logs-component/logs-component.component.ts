import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { LogsService } from 'src/app/service/logs.service';

@Component({
  selector: 'app-logs-component',
  templateUrl: './logs-component.component.html',
  styleUrls: ['./logs-component.component.css']
})
export class LogsComponentComponent implements OnInit, OnDestroy {
  /**
    *Gestione della pagina /#/logmanagement
  */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
    *displayedColumns - Array di stringhe utilizzato dalla matTable per generare le colonne della tabella
    * In Ordine: Data log, Utente, nome dell'operazione effettuata, nome del componente che esegue l'operazione
    */
  public displayedColumns: string[] = ['date', "nomeUtente", "nomeOperazione", "nomeComponente"];
  public dataSource = new MatTableDataSource<any>();
  public formGroup: FormGroup;
  public start = moment(moment.now()).subtract(30, 'day').format("yyyy-MM-DD 00:00:00");
  public end = moment(moment.now()).format("yyyy-MM-DD 23:59:59");
  public complete = true;
  public compNames:string[]; //nomi di tutti i componenti
  public showOpNames:string[]; //nome operazioni che vengono mostrate nella select
  private opNames:string[]; //nomi di tutte le operazioni
  private subscription: Subscription[] = [];

  constructor(
    private logService : LogsService
  ) { }

  /*
    * Popola le 2 select per Ricerca per componente e ricerca per operazione
  * */
  ngOnInit(): void {

    this.formGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
      name: new FormControl(),
      componentName: new FormControl(),
      operation: new FormControl()
    });

    this.getComponentsName(); //chiamata per prendere lista nomi componenti
    this.getOperationsName(); //chiamata per prendere lista nomi operazioni

    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  /**
    * Chiamata per popolare la tabella
   */
  public callGetAPI(): void{

    const startDate =  moment(this.formGroup.get('start')?.value).format('yyyy-MM-DD H:mm:ss');
    const endDate = moment(this.formGroup.get('end')?.value).format('yyyy-MM-DD H:mm:ss');
    const name = this.formGroup.get('name')?.value;
    const componentName = this.formGroup.get('componentName')?.value;
    const operation = this.formGroup.get('operation')?.value;

    //se una delle date non è valida non faccio la chiamata
    if (startDate.toUpperCase() == "Invalid date".toUpperCase() || endDate.toUpperCase() == "Invalid date".toUpperCase()) return;

    this.subscription.push(this.logService.getListLogs(startDate, endDate, name, componentName, operation).subscribe({
      next: logs => {
        logs.sort((a, b) => this.orderDate(a.date, b.date, true));
        this.dataSource.data = logs;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  /*
  * Chiamata per prendere tutte i nomi dei componenti
  * */
  getComponentsName():void{
    this.subscription.push(this.logService.getComponentsName().subscribe({
      next: compNames => {
        this.compNames = compNames;
      }
    }));
  }

  /*
  * Chiamata per prendere tutte i nomi delle operazioni
  * */
  getOperationsName():void{
    this.subscription.push(this.logService.getOperationsName().subscribe({
      next: opNames => {
        this.opNames = opNames;
        this.changeOpShowed();
      }
    }));
  }

  /**
   * Aggiorna la lista delle operazioni nella select in base al componente selezionato
   */
  changeOpShowed():void{
    const compName = this.formGroup.get('componentName')?.value;
    this.showOpNames = [];

    if (!compName) this.showOpNames = this.opNames;
    else {
      this.opNames.forEach(op => {
        if (op.toUpperCase().includes(compName.toUpperCase()))
          this.showOpNames.push(op);
      });
    }
  }

  //usato per ordinare i logs per data tramite la funzione sort
  private orderDate(a: any, b: any, desc = false): number {
    a = moment(a).format('yyyy-MM-DD H:mm:ss');
    b = moment(b).format('yyyy-MM-DD H:mm:ss');

    const d1 = new Date(a);
    const d2 = new Date(b);

    if (!desc){ //riordina in modo crescente
      if (d1> d2 ) return 1;

      else if (d1 < d2) return -1;
    }

    if (desc) { //riordina in modo decrescente
      if (d1 > d2) return -1;

      else if (d1 < d2) return 1;
    }

    return 0; //date uguali
  }
}
