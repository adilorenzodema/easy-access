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
  /* public formGroup: FormGroup;
  public picker: Date | null;
  public holidays: Calendar[] = [];
  public holidays2: Date[] = []; */
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
    if (this._findDate(date) !== -1) {
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
        });
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
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
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
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
    const index = this._findDate(date);
    this.model.splice(index, 1);
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }
}

