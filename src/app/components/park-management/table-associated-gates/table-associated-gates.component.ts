
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { GateAssociated } from 'src/app/domain/interface';


@Component({
  selector: 'app-table-associated-gates',
  templateUrl: './table-associated-gates.component.html',
  styleUrls: ['./table-associated-gates.component.css']
})
export class TableAssociatedGatesComponent implements OnInit, OnChanges, OnDestroy {
  /*
   * Gestisce la tabella dei varchi associati al parcheggio
   * In Input prende l'id del parcheggio e la lista dei varchi associati
  * */
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

  constructor() { }

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


  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssGates.filter = filterValue.trim().toLowerCase();
  }
}

