import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { ParkAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

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
export class TableAssociatedParkComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() allAssociatedParks: ParkAssociated[];
  @Input() idArea: number;
  @Output() updateAssociatedUsers = new EventEmitter<void>();
  public viewMode = true;
  public associatedParks: ParkAssociated[];
  public dataSourceAssParks = new MatTableDataSource<ParkAssociated>();
  public displayedColumnsParks = ['idPark', 'namePark'];
  public formGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    private areaManageService: AreaManagementService,
    private snackBar: SnackBar) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlSearch: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allAssociatedParks']) {
      this.associatedParks = [];
      this.allAssociatedParks.forEach((park) => { if (park.associated) this.associatedParks.push(park); });
      this.dataSourceAssParks.data = this.associatedParks;
      this.dataSourceAssParks.sort = this.sort;
      this.dataSourceAssParks.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  public saveAssociation(): void {
    this.subscription.push(this.areaManageService.editAssociateParkArea(this.idArea, this.dataSourceAssParks.data).subscribe({
      error: () => (this.snackBar.showMessage('errore nell`associazione', "ERROR")),
      complete: () => (this.snackBar.showMessage('associazione eseguita con successo', "INFO"), this.changeViewEdit(), this.updateAssociatedUsers.emit())
    }));
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
