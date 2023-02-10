import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  public displayedColumns: string[] = ['idTransit', 'codeObu', 'startDate'];
  public dataSource = new MatTableDataSource<Transit>();
  public start = moment(moment.now()).subtract(2, 'day');
  public end = moment(moment.now());
  public formGroup: FormGroup;
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(private transitService: TransitService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
    });
    this.callGetAPI();
  }

  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const start = moment(this.formGroup.get('start')?.value).format('yyyy-MM-DD');
      const end = moment(this.formGroup.get('end')?.value).format('yyyy-MM-DD');
      this.subscription.push(this.transitService.getTransitList(start, end).subscribe({
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
