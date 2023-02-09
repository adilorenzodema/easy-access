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

@Component({
  selector: 'app-edit-park',
  templateUrl: './edit-park.component.html',
  styleUrls: ['./edit-park.component.css']
})
export class EditParkComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public viewMode = true;
  public complete = true;
  public park!: Park;
  public active!: boolean;
  inputParkForm!: FormGroup;
  public dataSource = new MatTableDataSource<Area>;
  areas: Area[] = [];
  public associatedAreas: Area[] = [];
  subscription: Subscription[] = [];
  public displayedColumns = ['areaName'];
  constructor(
    public translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private parkManagementService: ParkManagementService) {

    this.park = this.router.getCurrentNavigation()?.extras.state?.['park'] as Park;
    this.active = this.router.getCurrentNavigation()?.extras.state?.['active'] as boolean;
    if (!this.park) { this.router.navigate(['/parking-management']); }
  }

  ngOnInit(): void {
    this.inputParkForm = this.formBuilder.group({
      ctrlParkName: [this.park.namePark, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkAddress: [this.park.address, [Validators.required, Validators.pattern('[a-zA-Z0-9\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkLocation: [this.park.locality, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCAP: [this.park.cap, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCountry: [this.park.country, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlSearch: ['']
    });
    this.getAreas();
    console.log("Aree: " + this.areas);
  }

  public filter(): void {
    const filterValue = this.inputParkForm.get('ctrlSearch')?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public changeViewEdit(): void {
    if (this.viewMode) {
      this.dataSource.data = this.areas;
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ['areaName', 'associated'];
      this.viewMode = false;
    } else {
      this.dataSource.data = this.associatedAreas;
      this.dataSource.paginator = this.paginator;
      this.displayedColumns = ['areaName'];
      this.viewMode = true;
    }
  }

  public saveAssociation(): void {
    console.log(this.inputParkForm);
  }

  private getAreas(): void {
    /*     this.subscription.push(this.parkManagementService.getAssociateAreaPark(this.park.idPark).subscribe((res) => {
          this.areas = res;
          forEach((area) => { if (area.associated) this.associatedAreas.push(area); });
        })); */
    forkJoin({
      assAreas: this.parkManagementService.getAssociateAreaPark(this.park.idPark),
      assGates: ""
    }).subscribe({
      next: ({ assAreas, assGates }) => {
        console.log(assAreas)
        this.areas = assAreas;
       /*  assAreas.forEach((area) => { if (area.associated) this.associatedAreas.push(area); });
        this.dataSource.data = this.associatedAreas;
        this.dataSource.paginator = this.paginator;
      */}
    });
  }
}

