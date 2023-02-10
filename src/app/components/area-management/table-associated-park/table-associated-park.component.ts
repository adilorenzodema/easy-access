import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  @Input() allAssociatedParks!: ParkAssociated[];
  @Input() viewMode = true;
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
    }
    if (changes['viewMode'] && !changes['viewMode'].firstChange) {
      if (!this.viewMode) {
        this.dataSourceAssParks.data = this.allAssociatedParks;
        this.displayedColumnsParks = this.displayedColumnsParks.concat('associated');
      } else {
        this.dataSourceAssParks.data = this.associatedParks;
        this.displayedColumnsParks.pop();
      }
    }
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssParks.filter = filterValue.trim().toLowerCase();
  }
}
