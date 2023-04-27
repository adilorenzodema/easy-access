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
  /**
   *Creazione della tabella Incidenti nella pagina /#/dashboard
   */
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() parkStatus: ParkStatus[];
  public allIncidentList: TableIncident[] = [];
  public dataSource = new MatTableDataSource<TableIncident>();
  public displayedColumns = ['startDate', 'endDate', 'gateName', 'parkName', 'device', 'errorCode', 'errorMessage', 'status'];

  constructor() { }

  ngOnInit(): void {
    this.saveAllIncident();
  }

  /*
 * Prende in input la variabile parkStatus dal componente Dashboard, e popola la tabella degli incidenti, ordinati per data di inizio più recente
 */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (row: TableIncident, columnName: string) => {
      switch (columnName) {
        case 'startDate': return row.incident.startDate;
        case 'parkName': return row.parkName;
        case 'startDate': return row.incident.startDate;
        case 'endDate' : return row.incident.endDate;
        case 'gateName': return row.incident.gateName;
        default: return columnName;
      }
    };
    this.sort.sortChange.emit({ active: 'startDate', direction: 'desc' });
  }

  private saveAllIncident(): void {
    this.parkStatus.forEach(
      (park) => park.incidentList.forEach(
        (list) => this.allIncidentList.push({ parkName: park.parkName, incident: list })
      )
    );
    this.dataSource.data = this.allIncidentList;
    console.log("incidents = ", this.allIncidentList);
  }
}
