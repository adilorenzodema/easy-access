import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { TransitService } from 'src/app/service/transit-management.service';
import { Transit } from '../../domain/interface';

@Component({
  selector: 'app-transit',
  templateUrl: './transit.component.html',
  styles: [
  ]
})
export class TransitComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['idTransit', 'codeObu', 'startDate', 'endDate', 'gate', 'park', 'validationType', 'flagPassed'];
  public dataSource = new MatTableDataSource<Transit>();
  public start = moment(moment.now()).subtract(22, 'day');
  public end = moment(moment.now());
  public formGroup: FormGroup;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(private transitService: TransitService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
      ctrlOBUSearch: new FormControl(''),
      ctrlParkSearch: new FormControl(''),
      ctrlGateSearch: new FormControl(''),
      ctrlValidationType: new FormControl(''),
      ctrlStatus: new FormControl('')
    });
    this.callGetAPI();
  }

  // obuCodeKeyword: string, gateNameKeyword: string, parkNameKeyword: string, validationType: string, flagTransited: boolean
  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const start = moment(this.formGroup.get('start')?.value).format('yyyy-MM-DD');
      const end = moment(this.formGroup.get('end')?.value).format('yyyy-MM-DD');
      const obuSearch = this.formGroup.get('ctrlOBUSearch')?.value;
      const parkSearch = this.formGroup.get('ctrlParkSearch')?.value;
      const gateSearch = this.formGroup.get('ctrlGateSearch')?.value;
      const validationType = this.formGroup.get('ctrlValidationType')?.value;
      var flagTransited: boolean | null;
      flagTransited = this.formGroup.get('ctrlStatus')?.value;
      this.subscription.push(this.transitService.getTransitList(start, end, obuSearch, gateSearch, parkSearch, validationType, flagTransited ).subscribe({
        next: transit => {
          this.dataSource.data = transit;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
    }
  }

}
