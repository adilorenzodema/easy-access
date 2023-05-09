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
  public displayedColumns: string[] = ['idTransit', 'codeObu', 'obuStd', 'startDate', 'gate', 'park', 'validationType', 'flagPassed'];
  public dataSource = new MatTableDataSource<Transit>();
  public start = moment(moment.now()).subtract(30, 'day').format("yyyy-MM-DD 00:00:00");
  public end = moment(moment.now()).format("yyyy-MM-DD 23:59:59");
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

  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const startDate = moment(this.formGroup.get('start')?.value).format('yyyy-MM-DD H:mm:00');
      const endDate = moment(this.formGroup.get('end')?.value).format('yyyy-MM-DD H:mm:59');
      const obuSearch = this.formGroup.get('ctrlOBUSearch')?.value;
      const parkSearch = this.formGroup.get('ctrlParkSearch')?.value;
      const gateSearch = this.formGroup.get('ctrlGateSearch')?.value;
      const validationType = this.formGroup.get('ctrlValidationType')?.value;
      var flagTransited: boolean | null;
      flagTransited = this.formGroup.get('ctrlStatus')?.value;
      this.subscription.push(this.transitService.getTransitList(startDate, endDate, obuSearch, gateSearch, parkSearch, validationType, flagTransited ).subscribe({
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
