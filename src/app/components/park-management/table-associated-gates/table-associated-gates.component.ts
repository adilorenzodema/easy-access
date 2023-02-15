
import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AreaAssociated, GateAssociated, ParkAssociated } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';


@Component({
  selector: 'app-table-associated-gates',
  templateUrl: './table-associated-gates.component.html',
  styleUrls: ['./table-associated-gates.component.css']
})
export class TableAssociatedGatesComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() allAssociatedGates: GateAssociated[];
  @Input() idPark: number; //idArea
  @Output() updateAssociatedGates = new EventEmitter<void>();
  public viewMode = true;
  public associatedGates: GateAssociated[];
  public dataSourceAssGates = new MatTableDataSource<GateAssociated>();
  public displayedColumnsGates = ['idGate', 'gateDescription'];
  public formGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    private parkManageService: ParkManagementService,
    private snackBar: SnackBar) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlSearch: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allAssociatedGates']) {
      this.associatedGates = [];
      this.allAssociatedGates.forEach((gate) => { if (gate.associated) this.associatedGates.push(gate); });
      this.dataSourceAssGates.data = this.associatedGates;
      this.dataSourceAssGates.sort = this.sort;
      this.dataSourceAssGates.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  public saveAssociation(): void {
    this.subscription.push(this.parkManageService.editAssociateParkGate(this.idPark, this.dataSourceAssGates.data).subscribe({
      error: () => (this.snackBar.showMessage('errore nell`associazione', "ERROR")),
      complete: () => (this.snackBar.showMessage('associazione eseguita con successo', "INFO"), this.changeViewEdit(), this.updateAssociatedGates.emit())
    }));
  }

  public changeViewEdit(): void {
    if (this.viewMode) {
      this.displayedColumnsGates = this.displayedColumnsGates.concat('associated');
      this.dataSourceAssGates.data = this.allAssociatedGates;
      this.dataSourceAssGates.sort = this.sort;
      this.dataSourceAssGates.paginator = this.paginator;
      this.viewMode = false;
    } else {
      this.displayedColumnsGates.pop();
      this.dataSourceAssGates.data = this.associatedGates;
      this.dataSourceAssGates.sort = this.sort;
      this.dataSourceAssGates.paginator = this.paginator;
      this.viewMode = true;
    }
    console.log( this.associatedGates);
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssGates.filter = filterValue.trim().toLowerCase();
  }
}

