import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Calendar } from 'src/app/domain/interface';
import { HolidaysService } from 'src/app/service/holidays.service';
import { ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-holidays-component',
  templateUrl: './holidays-component.component.html',
  styleUrls: ['./holidays-component.component.css']
})
export class HolidaysComponentComponent implements OnInit {
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;
  public defaultYear = moment().year(); //anno selezionato nella select
  public years: number[] = [];
  public complete = true;
  public modelCalendar: Date[] = [];
  public selected: Date | null;
  public modelClasses: Date[] = [];
  public closeOnSelected = false;
  public init = new Date();
  public resetModel = new Date(0);
  public model: Date[] = []; //array delle festività
  public minDate: Date;
  public maxDate: Date;
  private subscription: Subscription[] = [];
  constructor(
    private holidaysService: HolidaysService,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) {
  }

  /*
   * Colora le date selezionate nel calendario
  * */
  public dateClass = (date: Date): string[] => {

    if (this._findDate(date) !== -1) {
      return ['selected'];
    }
    return [];
  };

  /**
   * Popola la select degli anni e prende le festività dell'anno attuale
   */
  ngOnInit(): void {
    for (let year = this.defaultYear; year <= 2030; year++) {
      this.years.push(year);
    };
    this.callGetAPI();
  }

  /**
   * Prende tutte le festività dell'anno selezionato (defaultYear)
   */
  public callGetAPI(): void {
    this.minDate = new Date(this.defaultYear + "/01/01");
    this.maxDate = new Date(this.defaultYear + "/12/31");
    this.model = [];
    this.complete = false;
    const startDate = moment(this.defaultYear + '/01/01').format('yyyy-MM-DD');
    const endDate = moment(this.defaultYear + '/12/31').format('yyyy-MM-DD');
    this.subscription.push(this.holidaysService.getCalendar(startDate, endDate).subscribe({
      next: date => {
        date.map((singledate) => {
          this.model.push(singledate.date);
          this.model.sort();
        });
      },
      error: () => this.complete = true,
      complete: () => {
        this.model.sort((a, b) => this.orderDate(a, b));
        this.complete = true;
      }
    }));
  }

  /**
   * Chiamata per aggiornare la lista delle festività ne BE
   * A BE vengono mandati sia l'anno selezionato che l'array di date model
   * @param {number} defaultYear anno selezionato
   */
  public addCalendar(defaultYear: number): void {
    const holidays = this.model;
    this.holidaysService.addCalendar(holidays, defaultYear).subscribe({
      next: () => {
        this.snackBar.showMessage(this.translate.instant('select_holidays.updateSnackbar'), 'INFO');
      },
      complete: () => (this.complete = true, this.callGetAPI())
    });
  }

  /*
   * Viene chiamata quando viene selezionato un giorno nel calendario.
   * Se la data selezionata è gia presente nell'array model, allora la rimuove
   * altrimenti la inserisce nell'array e poi fa il sort
   * @param {MatDatepickerInputEvent<Date>} event
  * */
  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const index = this._findDate(event.value);

      if (index === -1) {;
        this.model.push(event.value);
        this.model.sort((a, b) => this.orderDate(a, b));
      } else {
        this.model.splice(index, 1);
      }
      this.resetModel = new Date(0);
      if (!this.closeOnSelected) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        this._picker['_componentRef'].instance._calendar.monthView._createWeekCells();
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  /**
  * Inserisce tutte le festività dell'anno selezionato dentro l'array di date model
  * Dopo l'inserimento ordina tutte le date in model
  * @param {number} year
  */
  public getYearHolidays(year: number): void{
    let dates:Date[] = [];
    const capodanno = new Date(year + "/01/01");
    const epifania = new Date(year + "/01/06");
    const liberazione = new Date(year + "/04/25");
    const pasqua = this.getEaster(year);
    const pasquetta = this.getEaster(year);
    pasquetta.setDate(pasquetta.getDate() +1);
    const festaLavoro = new Date(year + "/05/01");
    const festaRepubblica = new Date(year + "/06/02");
    const assunzione = new Date(year + "/08/15");
    const ognisanti = new Date(year + "/11/01");
    const immacolata = new Date(year + "/12/08");
    const natale = new Date(year + "/12/25");
    const santoStefano = new Date(year + "/12/26");

    //inserire nelle festività
    dates = [capodanno, epifania, liberazione, pasqua, pasquetta, festaLavoro, festaRepubblica, assunzione, ognisanti, immacolata, natale, santoStefano];

    for(const d of dates) {
      if (this._findDate(d) == -1) this.model.push(d);
    }

    this.model.sort((a, b) => this.orderDate(a, b));
  }

  /**
   * Elimina la data selezionata
   *
   * @param {Date} date Data da rimuovere
   */
  public remove(date: Date): void {
    /*   const mDate = moment(date).format('yyyy-MM-DD'); //.split('T')[0]
      const mDate1= new Date(mDate);
      const mDate2 = mDate1.toISOString().split('T')[0];
    */
    const index = this._findDateRemoved(date);
    this.model.splice(index, 1);
  }

  /*
   * Funzione per ricercare le date all'interno dell'array di date model
   * @param date, Data da cercare
   * @returns Indirizzo dell'array che contiene la data trovata o -1 in caso non trovi niente
  * */
  private _findDate(date: Date): number {
    let d: string;
    const myDate:string = moment(date).format('yyyy-MM-DD');
    for (const i in this.model) {
      d = moment(this.model[i]).format('yyyy-MM-DD');
      if (d === myDate) {
        return +i;
      }
    }
    return -1;
  }

  /*
   * Funzione per ricercare le date all'interno dell'array di date model
   * @param date, Data da cercare
   * @returns Indirizzo dell'array che contiene la data trovata o -1 in caso non trovi niente
  * */
  private _findDateRemoved(date: Date): number {
    let d: any;
    const dateTMP = moment(date).format('yyyy-MM-DD');
    for (const i in this.model) {
      d = moment(this.model[i]).format('yyyy-MM-DD');
      if (d === dateTMP) {
        return +i;
      }
    }
    return -1;
  }

  /**
   * Riordina 2 date in ordine crescente
   * Funzione utilizzata dalla funzione sort() per riordinare l'array di date.
   * @param {*} a
   * @param {*} b
   * @returns {number}
   */
  private orderDate(a: any, b: any): number {
    a = moment(a).format('yyyy-MM-DD');
    b = moment(b).format('yyyy-MM-DD');

    const d1 = new Date(a);
    const d2 = new Date(b);

    if (d1.getTime() > d2.getTime()) return 1;

    else if (d1.getTime() < d2.getTime()) return -1;

    else return 0; //date uguali
  }

  /*
   * Calcola il giorno di pasqua in base all'anno passato in input
   * @param {number} year, anno intero (es: 2023)
   * @returns data di pasqua
  * */
  private getEaster(year: number): Date{
    var C = Math.floor(year/100);
    var N = year - 19*Math.floor(year/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = year + Math.floor(year/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    return new Date(this.padout(M) + '-' + this.padout(D) + '-' +year);
  }

  /*
   * In caso il giorno o il mese sia minore di 10 mette lo 0 davanti
   * utilizzato per scrivere le date nel formato corretto in getEaster(year)
  * */
  private padout(number): any {
    return (number < 10) ? '0' + number : number;
  }
}

