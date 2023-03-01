import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AreaAssociated, ParkAssociated } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';


@Component({
  selector: 'app-table-associated-areas',
  templateUrl: './table-associated-areas.component.html',
  styleUrls: ['./table-associated-areas.component.css']
})
export class TableAssociatedAreasComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() allAssociatedAreas: AreaAssociated[]; //parkassociated
  @Input() idPark: number; //idArea
  @Output() updateAssociatedAreas = new EventEmitter<void>();
  public viewMode = true;
  public associatedAreas: AreaAssociated[];
  public dataSourceAssAreas = new MatTableDataSource<AreaAssociated>();
  public displayedColumnsAreas = ['idArea', 'areaName'];
  public formGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    private parkManageService: ParkManagementService,
    private snackBar: SnackBar,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlSearch: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allAssociatedAreas']) {
      this.associatedAreas = [];
      this.allAssociatedAreas.forEach((area) => { if (area.associated) this.associatedAreas.push(area); });
      this.dataSourceAssAreas.data = this.associatedAreas;
      this.dataSourceAssAreas.sort = this.sort;
      this.dataSourceAssAreas.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  public saveAssociation(): void {
    this.subscription.push(this.parkManageService.editAssociateParkArea(this.idPark, this.dataSourceAssAreas.data).subscribe({
      error: () => (this.snackBar.showMessage(this.translate.instant('manage_parks.associationErrorSnackbar'), "ERROR")),
      complete: () => (this.snackBar.showMessage(this.translate.instant('manage_parks.associationComplete'),
        "INFO"), this.changeViewEdit(), this.updateAssociatedAreas.emit())
    }));
  }

  public changeViewEdit(): void {
    if (this.viewMode) {
      this.displayedColumnsAreas = this.displayedColumnsAreas.concat('associated');
      this.dataSourceAssAreas.data = this.allAssociatedAreas;
      this.dataSourceAssAreas.sort = this.sort;
      this.dataSourceAssAreas.paginator = this.paginator;
      this.viewMode = false;
    } else {
      this.displayedColumnsAreas.pop();
      this.dataSourceAssAreas.data = this.associatedAreas;
      this.dataSourceAssAreas.sort = this.sort;
      this.dataSourceAssAreas.paginator = this.paginator;
      this.viewMode = true;
    }
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssAreas.filter = filterValue.trim().toLowerCase();
  }
}
