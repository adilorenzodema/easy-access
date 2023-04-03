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
  public minDate: Date;
  public maxDate: Date;
  private subscription: Subscription[] = [];
  constructor(
    private holidaysService: HolidaysService,
    private snackBar: SnackBar,
    private translate: TranslateService
  ) {
  }
  public dateClass = (date: Date): string[] => {
    const d: any = new Date(date.setDate(date.getDate() + 1));
    //moment(date).add('day', 1).toDate();

    if (this._findDate(d) !== -1) {
      return ['selected'];
    }
    return [];
  };

  ngOnInit(): void {
    for (let year = this.defaultYear; year <= 2030; year++) {
      this.years.push(year);
    };
    this.callGetAPI();
  }

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

  public addCalendar(defaultYear: number): void {
    const holidays = this.model;
    this.holidaysService.addCalendar(holidays, defaultYear).subscribe({
      next: () => {
        this.snackBar.showMessage(this.translate.instant('select_holidays.updateSnackbar'), 'INFO');
      },
      complete: () => (this.complete = true, this.callGetAPI())
    });
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      /* let date = event.value; */
      moment(event.value).add(1, 'day');
      /* date = new Date(date.setDate(date.getDate()+1)); */
      const index = this._findDate(event.value);

      if (index === -1) {
        /* date = new Date(date.setDate(date.getDate()-1)); */
        moment(event.value).subtract(1, 'day');
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

  public remove(date: Date): void {
    /*   const mDate = moment(date).format('yyyy-MM-DD'); //.split('T')[0]
      const mDate1= new Date(mDate);
      const mDate2 = mDate1.toISOString().split('T')[0];
      console.log("data prima check", mDate1);
      console.log("data prima check ISO", mDate2); */
    const index = this._findDateRemoved(date);
    this.model.splice(index, 1);
  }

  private _findDate(date: Date): number {
    let d: any;
    for (const i in this.model) {
      d = moment(this.model[i]).format('yyyy-MM-DD');
      if (d === date.toISOString().split('T')[0]) {
        return +i;
      }
    }
    return -1;
  }

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

  private orderDate(a: any, b: any): number {
    // console.log("a = ", typeof a);
    // console.log("b: ", b);

    a = moment(a).format('yyyy-MM-DD');
    b = moment(b).format('yyyy-MM-DD');

    const d1 = new Date(a);
    const d2 = new Date(b);

    if (d1.getTime() > d2.getTime()) return 1;

    else if (d1.getTime() < d2.getTime()) return -1;

    else return 0; //date uguali
  }
}

