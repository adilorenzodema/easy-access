import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Area } from 'src/app/domain/class';
import { UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.css']
})
export class EditAreaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public area: Area;
  public formGroup!: FormGroup;
  public dataSource = new MatTableDataSource<UserAssociated>;
  public displayedColumns = ['firstName'];
  public users: UserAssociated[] = [];
  public grantedUsers: UserAssociated[] = [];
  public viewModeUser = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private areaManageService: AreaManagementService,
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
    this.apiGetAssociateUserArea();
  }

  public filter(): void {
    const filterValue = this.formGroup.get('ctrlSearch')?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public changeViewEdit(): void {
    if (this.viewModeUser) {
      this.dataSource.data = this.users;
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ['firstName', 'granted'];
      this.viewModeUser = false;
    } else {
      this.dataSource.data = this.grantedUsers;
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ['firstName'];
      this.viewModeUser = true;
    }
  }

  public saveAssociation(): void {
    console.log(this.dataSource.data)
  }

  private apiGetAssociateUserArea(): void {
    this.areaManageService.getAssociateUserArea(this.area.idArea).subscribe(
      (users) => (
        this.users = users,
        users.forEach(
          (user) => { if (user.granted) this.grantedUsers.push(user); }
        ),
        this.dataSource.data = this.grantedUsers,
        this.dataSource.paginator = this.paginator
      )
    );
  }

}
