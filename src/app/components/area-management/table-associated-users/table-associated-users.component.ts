import { EventEmitter, Output } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';
@Component({
  selector: 'app-table-associated-users',
  templateUrl: './table-associated-users.component.html',
  styles: [`
  table {
    width: 90%;
  }
  `
  ]
})
export class TableAssociatedUsersComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() allAssociatedUsers: UserAssociated[];
  @Input() idArea: number;
  @Output() updateAssociatedUsers = new EventEmitter<void>();
  public viewMode = true;
  public associatedUsers: UserAssociated[];
  public dataSourceAssUsers = new MatTableDataSource<UserAssociated>();
  public displayedColumnsUsers = ['firstName', 'lastName'];
  public formGroup: FormGroup;

  private subscription: Subscription[] = [];

  constructor(
    private snackBar: SnackBar,
    private areaManageService: AreaManagementService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ctrlSearch: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['allAssociatedParks']?.firstChange) {
      this.associatedUsers = [];
      this.allAssociatedUsers.forEach((user) => { if (user.granted) this.associatedUsers.push(user); });
      this.dataSourceAssUsers.data = this.associatedUsers;
      this.dataSourceAssUsers.sort = this.sort;
      this.dataSourceAssUsers.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

  public saveAssociation(): void {
    this.subscription.push(this.areaManageService.editAssociateUserArea(this.idArea, this.dataSourceAssUsers.data).subscribe({
      error: () => (this.snackBar.showMessage(this.translate.instant('manage_areas.associationError'), "ERROR")),
      complete: () => (this.snackBar.showMessage(this.translate.instant('manage_areas.associationComplete'),
        "INFO"), this.changeViewEdit(), this.updateAssociatedUsers.emit())
    }));
  }

  public changeViewEdit(): void {
    if (this.viewMode) {
      this.displayedColumnsUsers = this.displayedColumnsUsers.concat('granted');
      this.dataSourceAssUsers.data = this.allAssociatedUsers;
      this.dataSourceAssUsers.sort = this.sort;
      this.dataSourceAssUsers.paginator = this.paginator;
      this.viewMode = false;
    } else {
      this.displayedColumnsUsers.pop();
      this.dataSourceAssUsers.data = this.associatedUsers;
      this.dataSourceAssUsers.sort = this.sort;
      this.dataSourceAssUsers.paginator = this.paginator;
      this.viewMode = true;
    }
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssUsers.filter = filterValue.trim().toLowerCase();
  }

}
