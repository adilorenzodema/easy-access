import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { IncidentsManagementService } from 'src/app/service/incidents-management.service';
import { Incident } from '../../domain/interface';

@Component({
  selector: 'app-incidents-management',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['startDate', 'endDate', 'gateName', 'parkName', 'device', 'errorCode', 'status'];
  public dataSource = new MatTableDataSource<Incident>();
  public start = moment(moment.now()).subtract(22, 'day').format("yyyy-MM-DD 00:00:00");
  public end = moment(moment.now()).format("yyyy-MM-DD 23:59:59");
  public formGroup: FormGroup;
  public complete = true;
  public parkByIncidents;
  public listaCodErrori = [];
  private subscription: Subscription[] = [];

  constructor(
    private incidentsManagementService: IncidentsManagementService,
    private router: Router,) {
    this.parkByIncidents = this.router.getCurrentNavigation()?.extras.state?.['parkName'] as string;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      start: new FormControl(moment(this.start).toDate(), Validators.required),
      end: new FormControl(moment(this.end).toDate(), Validators.required),
      ctrlParkSearch: new FormControl(''),
      ctrlGateSearch: new FormControl(''),
      ctrlComponent: new FormControl(''),
      ctrlErrorCode: new FormControl(''),
      ctrlStatus: new FormControl('')
    });
    if(this.parkByIncidents) this.formGroup.patchValue({ctrlParkSearch: this.parkByIncidents});
    this.callGetAPI();

    this.getAllCodeErrors();
  }

  public callGetAPI(): void {
    if (!this.formGroup.invalid) {
      this.complete = false;
      const start = moment(this.formGroup.get('start')?.value).format('yyyy-MM-DD' + '00:00:00');
      const end = moment(this.formGroup.get('end')?.value).format('yyyy-MM-DD' + '23:59:59');
      const parkSearch = this.formGroup.get('ctrlParkSearch')?.value;
      const gateSearch = this.formGroup.get('ctrlGateSearch')?.value;
      const errorCode = this.formGroup.get('ctrlErrorCode')?.value;
      const component = this.formGroup.get('ctrlComponent')?.value;
      var status = this.formGroup.get('ctrlStatus')?.value;
      if (status === "Risolto") status = true;
      else if (status === "In corso") status = false;
      this.subscription.push(this.incidentsManagementService.getIncidentsList(start, end, gateSearch, parkSearch, component, errorCode, status).subscribe({
        next: incident => {
          this.dataSource.data = incident;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => this.complete = true,
        complete: () => this.complete = true
      }));
    }
  }

  getAllCodeErrors():void{
    this.subscription.push(this.incidentsManagementService.getAllErrorCodes().subscribe({
      next: code => {
        this.listaCodErrori = code;
      }
    }));
  }

}

