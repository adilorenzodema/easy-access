import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from 'dema-movyon-template';
import { forkJoin, Subscription } from 'rxjs';
import { Park } from 'src/app/domain/class';
import { AreaAssociated, GateAssociated } from 'src/app/domain/interface';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-edit-park',
  templateUrl: './edit-park.component.html',
  styleUrls: ['./edit-park.component.css']
})
export class EditParkComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public viewMode = true;
  public complete = true;
  public park: Park;
  public active: boolean;
  public inputParkForm: FormGroup;
  public areas: AreaAssociated[] = [];
  public gates: GateAssociated[] = [];
  public displayedColumns = ['areaName'];

  private subscription: Subscription[] = [];

  constructor(
    public translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private parkManagementService: ParkManagementService) {

    this.park = this.router.getCurrentNavigation()?.extras.state?.['park'] as Park;
    if (!this.park) { this.router.navigate(['/park-management']); }
    this.active = this.router.getCurrentNavigation()?.extras.state?.['active'] as boolean;
  }

  ngOnInit(): void {
    this.inputParkForm = this.formBuilder.group({
      ctrlParkName: [this.park.namePark, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkAddress: [this.park.address, [Validators.required, Validators.pattern('[a-zA-Z0-9\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkLocation: [this.park.location, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCAP: [this.park.cap, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCountry: [this.park.country, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlSearch: ['']
    });
    this.apiGetAssociation();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(
      (sub) => sub.unsubscribe()
    );
  }

  public saveDetails(): void {
    const parkName = this.inputParkForm.get('ctrlParkName').value;
    const parkAddress = this.inputParkForm.get('ctrlParkAddress').value;
    const parkLocation = this.inputParkForm.get('ctrlParkLocation').value;
    const parkCAP = this.inputParkForm.get('ctrlParkCAP').value;
    const parkCountry = this.inputParkForm.get('ctrlParkCountry').value;
    const editPark = new Park(parkName, parkCountry, parkLocation, parkCAP, parkAddress, this.park.idPark);
    this.subscription.push(this.parkManagementService.editParking(editPark).subscribe({
      next: () => this.snackBar.showMessage(this.translate.instant('manage_parks.editDetailsSuccess'), 'INFO'),
      complete: () => this.getParkById()
    }));
  }

  public apiGetAssociation(): void {
    this.complete = false;
    this.subscription.push(forkJoin({
      assAreas: this.parkManagementService.getAssociateAreaPark(this.park.idPark),
      assGates: this.parkManagementService.getAssociateGatePark(this.park.idPark)
    }).subscribe({
      next: ({ assAreas, assGates }) => {
        this.areas = assAreas;
        this.gates = assGates;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  private getParkById(): void {
    this.subscription.push(this.parkManagementService.getParkByIdPark(this.park.idPark).subscribe(
      (respPark) => this.park = respPark
    ));
  }
}

