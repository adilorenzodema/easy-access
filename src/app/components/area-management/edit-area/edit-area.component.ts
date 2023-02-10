import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBar } from 'dema-movyon-template';
import * as moment from 'moment';
import { forkJoin, Subscription } from 'rxjs';
import { Area } from 'src/app/domain/class';
import { ParkAssociated, UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.css']
})
export class EditAreaComponent implements OnInit, OnDestroy {
  public area: Area;
  public formGroup: FormGroup;
  public users: UserAssociated[] = [];
  public assParks: ParkAssociated[] = [];
  public viewModeUser = true;
  public complete = true;

  private subscription: Subscription[] = [];

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

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  public apiGetAssociation(): void {
    this.complete = false;
    this.subscription.push(forkJoin({
      assUsers: this.areaManageService.getAssociateUserArea(this.area.idArea),
      assParks: this.areaManageService.getAssociateParkArea(this.area.idArea)
    }).subscribe({
      next: ({ assUsers, assParks }) => {
        this.assParks = assParks;
        this.users = assUsers;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public saveDetails(): void {
    const areaName = this.formGroup.get('ctrlAreaName').value;
    const editArea = new Area(areaName, this.area.idArea);
    this.subscription.push(this.areaManageService.editArea(editArea).subscribe({
      next: () => this.snackBar.showMessage('Dettagli modificati correttamente', 'INFO'),
      complete: () => this.getAreaById()
    }));
  }

  private getAreaById(): void {
    this.subscription.push(this.areaManageService.getAreaByIdArea(this.area.idArea).subscribe(
      (respArea) => this.area = respArea
    ));
  }
}
