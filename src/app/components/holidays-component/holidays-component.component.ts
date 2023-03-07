import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { DateClass } from 'ngx-multiple-dates';
import { Subscription } from 'rxjs';
import { Calendar } from 'src/app/domain/class';
import { HolidaysService } from 'src/app/service/holidays.service';

@Component({
  selector: 'app-holidays-component',
  templateUrl: './holidays-component.component.html',
  styleUrls: ['./holidays-component.component.css']
})
export class HolidaysComponentComponent implements OnInit {
  public formGroup: FormGroup;
  public picker: Date | null;
  public holidays: Calendar[] = [];
  public holidays2: Date[] = [];
  public years: number[] = [];
  public complete = true;

  public selected: Date | null;
  public modelClasses: Date[] = [];

  public classes: DateClass[] = [
    { value: new Date('3/5/2021'), className: 'my-red' },
    { value: new Date('3/7/2021'), className: 'my-green' },
    { value: new Date('3/9/2021'), className: 'my-blue' }
  ];

  private subscription: Subscription[] = [];
  constructor(
    private holidaysService: HolidaysService,
    private snackBar: SnackBar,
    private translate: TranslateService,
    private datepipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    for (let year = 2023; year <= 2030; year++) {
      this.years.push(year);
    };
    this.callGetAPI(2023);
  }

  public callGetAPI(year: number): void {
    this.complete = false;
    const startDate = moment(moment().year() + '/01/01').format('yyyy-MM-DD');
    const endDate = moment(moment().year() + '/12/31').format('yyyy-MM-DD');
    console.log(startDate);
    this.subscription.push(this.holidaysService.getCalendar(startDate, endDate).subscribe({
      next: date => {
        console.log("model classes:" + this.modelClasses);
        date.map((singledate) => {
          // new Date(singledate.date)
          // new Date("7/3/2023") Mon Jul 03 2023;
          //moment(singledate.date).toDate()
          //new Date(singledate.date.getFullYear(), singledate.date.getMonth(), singledate.date.getUTCDate())
          if (singledate.flagHoliday) this.modelClasses.push(new Date(singledate.date));
        });
        console.log(typeof this.modelClasses);
        console.log(this.modelClasses);
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public addCalendar(): void {
    const holidays = this.modelClasses;
    const holidaysList: Calendar[] = [];
    holidays.forEach(item => {
      //incompatibili? date != string
      
      holidaysList.push(new Calendar(this.datepipe.transform(item, 'yyyy-MM-dd'), true));
    });
    console.log(holidaysList);
    this.holidaysService.addCalendar(holidaysList).subscribe({
      complete: () => this.snackBar.showMessage(this.translate.instant('manage_areas.areaInsert'), 'INFO')
    });

  }
}
