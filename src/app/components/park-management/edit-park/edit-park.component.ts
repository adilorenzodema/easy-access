import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription } from 'rxjs';
import { Area, Park } from 'src/app/domain/class';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { MatPaginator } from '@angular/material/paginator';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { AreaAssociated, GateAssociated } from 'src/app/domain/interface';
import { SnackBar } from 'dema-movyon-template';

@Component({
  selector: 'app-edit-park',
  templateUrl: './edit-park.component.html',
  styleUrls: ['./edit-park.component.css']
})
export class EditParkComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public viewMode = true;
  public complete = true;
  public park: Park;
  public active: boolean;
  inputParkForm: FormGroup;
  public dataSource = new MatTableDataSource<Area>;
  areas: AreaAssociated[] = [];
  gates: GateAssociated[] = [];
  public associatedAreas: AreaAssociated[] = [];
  public associatedGates: GateAssociated[] = [];
  subscription: Subscription[] = [];
  public displayedColumns = ['areaName'];
  constructor(
    public translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: SnackBar,
    private parkManagementService: ParkManagementService) {

    this.park = this.router.getCurrentNavigation()?.extras.state?.['park'] as Park;
    this.active = this.router.getCurrentNavigation()?.extras.state?.['active'] as boolean;
    if (!this.park) { this.router.navigate(['/parking-management']); }
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
    console.log("Aree: " + this.areas);
  }

  public saveDetails(): void {
    const parkName = this.inputParkForm.get('ctrlParkName').value;
    const parkAddress = this.inputParkForm.get('ctrlParkAddress').value;
    const parkLocation = this.inputParkForm.get('ctrlParkLocation').value;
    const parkCAP = this.inputParkForm.get('ctrlParkCAP').value;
    const parkCountry = this.inputParkForm.get('ctrlParkCountry').value;
    const editPark = new Park(parkName,parkCountry,parkLocation, parkCAP,parkAddress, this.park.idPark);
    this.subscription.push(this.parkManagementService.editParking(editPark).subscribe({
      next: () => this.snackBar.showMessage('Dettagli modificati correttamente', 'INFO'),
      complete: () => this.getParkById()
    }));
  }

  public saveAssociation(): void {
    console.log(this.inputParkForm);
  }

  public apiGetAssociation(): void {
    this.complete = false;
    forkJoin({
      assAreas: this.parkManagementService.getAssociateAreaPark(this.park.idPark),
      assGates: this.parkManagementService.getAssociateGatePark(this.park.idPark)
    }).subscribe({
      next: ({ assAreas, assGates }) => {
        this.areas = assAreas;
        this.gates = assGates;
        console.log("Gates: " + this.gates);
      /*   console.log(assAreas);
        this.areas = assAreas;
        assAreas.forEach((area) => { if (area.associated) this.associatedAreas.push(area); });
        console.log(assGates);
        this.gates = assGates;
        assGates.forEach((gate) => { if (gate.associated) this.associatedGates.push(gate); });
        this.dataSource.data = this.associatedAreas;
        this.dataSource.paginator = this.paginator; */
        //DA rivedere
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  private getParkById(): void {
    this.subscription.push(this.parkManagementService.getParkByIdPark(this.park.idPark).subscribe(
      (respPark) => this.park = respPark
    ));
  }
}

