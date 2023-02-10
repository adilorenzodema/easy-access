import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ParkAssociated } from 'src/app/domain/interface';

@Component({
  selector: 'app-table-associated-park',
  templateUrl: './table-associated-park.component.html',
  styles: [`
  table {
    width: 90%;
  }
  `
  ]
})
export class TableAssociatedParkComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() allAssociatedParks: ParkAssociated[];
  public viewMode = true;
  public associatedParks: ParkAssociated[] = [];
  public dataSourceAssParks = new MatTableDataSource<ParkAssociated>();
  public displayedColumnsParks = ['idPark', 'namePark'];
  public formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlSearch: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allAssociatedParks']) {
      this.allAssociatedParks.forEach((park) => { if (park.associated) this.associatedParks.push(park); });
      this.dataSourceAssParks.data = this.associatedParks;
      this.dataSourceAssParks.sort = this.sort;
      this.dataSourceAssParks.paginator = this.paginator;
    }
  }

  public changeViewEdit(): void {
    if (this.viewMode) {
      this.displayedColumnsParks = this.displayedColumnsParks.concat('associated');
      this.dataSourceAssParks.data = this.allAssociatedParks;
      this.dataSourceAssParks.sort = this.sort;
      this.dataSourceAssParks.paginator = this.paginator;
      this.viewMode = false;
    } else {
      this.displayedColumnsParks.pop();
      this.dataSourceAssParks.data = this.associatedParks;
      this.dataSourceAssParks.sort = this.sort;
      this.dataSourceAssParks.paginator = this.paginator;
      this.viewMode = true;
    }
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssParks.filter = filterValue.trim().toLowerCase();
  }
}
