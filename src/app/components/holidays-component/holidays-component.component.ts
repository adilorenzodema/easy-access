import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { DateClass } from 'ngx-multiple-dates';
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
  public formGroup: FormGroup;
  public picker: Date | null;
  public holidays: Calendar[] = [];
  public holidays2: Date[] = [];
  public defaultYear = moment().year();
  public years: number[] = [];
  public complete = true;
  public modelCalendar: Date[] = [];
  public selected: Date | null;
  public modelClasses: Date[] = [];
  public closeOnSelected = false;
  public init = new Date();
  public resetModel = new Date(0);
  public model: Date[] = [];
  private subscription: Subscription[] = [];
  constructor(
    private holidaysService: HolidaysService,
    private snackBar: SnackBar,
    private translate: TranslateService,
    private datepipe: DatePipe
  ) {
  }
  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return ['selected'];
    }
    return [];
  }

  ngOnInit(): void {
    for (let year = 2023; year <= 2030; year++) {
      this.years.push(year);
    };
    this.callGetAPI();
  }

  public callGetAPI(): void {
    this.model = [];
    this.complete = false;
    const startDate = moment(this.defaultYear + '/01/01').format('yyyy-MM-DD');
    const endDate = moment(this.defaultYear + '/12/31').format('yyyy-MM-DD');
    this.subscription.push(this.holidaysService.getCalendar(startDate, endDate).subscribe({
      next: date => {
        date.map((singledate) => {
          // new Date(singledate.date)
          // new Date("7/3/2023") Mon Jul 03 2023;
          //moment(singledate.date).toDate()
          //new Date(singledate.date.getFullYear(), singledate.date.getMonth(), singledate.date.getUTCDate())
          //(singledate.flagHoliday) ? this.model.push(new Calendar(singledate.date, true)) : this.model.push(new Calendar(singledate.date, false));;
          if (singledate.flagHoliday) this.model.push(singledate.date);
        });
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
    console.log(this.model);
  }

  public addCalendar(defaultYear: number): void {
    const holidays = this.model;
    //mandare giorno come path param
    console.log(defaultYear);
    console.log(holidays);
    console.log( holidays[0] instanceof Date);
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
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
  //modifica utente, salvare array e controllarre se uguali. Uguale: no modal diversi : si modal
  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1);
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }
}

