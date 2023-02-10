import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Area } from 'src/app/domain/class';
import { ParkAssociated, UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.css']
})
export class EditAreaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public area: Area;
  public formGroup: FormGroup;
  public dataSourceAssUsers = new MatTableDataSource<UserAssociated>;
  public displayedColumnsUsers = ['firstName', 'lastName'];
  public users: UserAssociated[] = [];
  public grantedUsers: UserAssociated[] = [];
  public assParks: ParkAssociated[] = [];
  public viewModeUser = true;
  public complete = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private areaManageService: AreaManagementService
  ) {
    this.area = this.router.getCurrentNavigation()?.extras.state?.['area'] as Area;
    if (!this.area) { this.router.navigate(['/area-management']); }
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlAreaName: [this.area.areaName, Validators.required],
      ctrlCreationDate: [moment(this.area.creationDate).format('DD/mm/YYYY')],
      ctrlSearch: ['']
    });
    this.apiGetAssociation();
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSourceAssUsers.filter = filterValue.trim().toLowerCase();
  }

  public changeViewEdit(): void {
    if (this.viewModeUser) {
      this.dataSourceAssUsers.data = this.users;
      this.dataSourceAssUsers.paginator = this.paginator;
      this.dataSourceAssUsers.sort = this.sort;
      this.displayedColumnsUsers = this.displayedColumnsUsers.concat('granted');
      this.viewModeUser = false;
    } else {
      this.dataSourceAssUsers.data = this.grantedUsers;
      this.dataSourceAssUsers.paginator = this.paginator;
      this.dataSourceAssUsers.sort = this.sort;
      this.displayedColumnsUsers.pop();
      this.viewModeUser = true;
    }
  }

  public saveAssociation(): void {
    this.areaManageService.editAssociateUserArea(this.area.idArea, this.dataSourceAssUsers.data).subscribe({
      error: () => (this.snackBar.showMessage('errore nell`associazione', "ERROR")),
      complete: () => (
        this.snackBar.showMessage('associazione eseguita con successo', "INFO"),
        this.router.navigate(['area-management'])
      )
    });
  }

  private apiGetAssociation(): void {
    this.complete = false;
    forkJoin({
      assUsers: this.areaManageService.getAssociateUserArea(this.area.idArea),
      assParks: this.areaManageService.getAssociateParkArea(this.area.idArea)
    }).subscribe({
      next: ({ assUsers, assParks }) => {
        this.assParks = assParks;
        this.users = assUsers;
        assUsers.forEach((user) => { if (user.granted) this.grantedUsers.push(user); });
        this.dataSourceAssUsers.data = this.grantedUsers;
        this.dataSourceAssUsers.paginator = this.paginator;
        this.dataSourceAssUsers.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

}
