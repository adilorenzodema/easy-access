import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ParkStatus, TableIncident } from 'src/app/domain/interface';

@Component({
  selector: 'app-table-incidents',
  templateUrl: './table-incidents.component.html',
  styleUrls: ['./table-incidents.component.css']
})
export class TableIncidentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() parkStatus: ParkStatus[];
  public allIncidentList: TableIncident[] = [];
  public dataSource = new MatTableDataSource<TableIncident>();
  public displayedColumns = ['idIncident', 'errorMessage', 'parkName', 'device', 'startDate'];

  constructor() { }

  ngOnInit(): void {
    this.saveAllIncident();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (row: TableIncident, columnName: string) => {
      switch (columnName) {
        case 'idIncident': return row.incident.idIncident;
        case 'parkName': return row.parkName;
        case 'startDate' : return row.incident.startDate;
        default: return columnName;
      }
    };
    this.sort.sortChange.emit({active: 'startDate', direction: 'desc'});
  }

  private saveAllIncident(): void {
    this.parkStatus.forEach(
      (park) => park.incidentList.forEach(
        (list) => this.allIncidentList.push({ parkName: park.parkName, incident: list })
      )
    );
    this.dataSource.data = this.allIncidentList;
  }
}
