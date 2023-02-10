import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  public area: Area;
  public formGroup: FormGroup;
  public users: UserAssociated[] = [];
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

  public apiGetAssociation(): void {
    this.complete = false;
    forkJoin({
      assUsers: this.areaManageService.getAssociateUserArea(this.area.idArea),
      assParks: this.areaManageService.getAssociateParkArea(this.area.idArea)
    }).subscribe({
      next: ({ assUsers, assParks }) => {
        this.assParks = assParks;
        this.users = assUsers;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

}
