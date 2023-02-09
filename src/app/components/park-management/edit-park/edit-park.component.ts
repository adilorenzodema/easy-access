import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Area, Park } from 'src/app/domain/class';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-edit-park',
  templateUrl: './edit-park.component.html',
  styleUrls: ['./edit-park.component.css']
})
export class EditParkComponent implements OnInit {
  public complete = true;
  public park!: Park;
  public idPark!: number;
  public namePark!: string;
  public address!: string;
  public location!: string;
  public cap!: string;
  public country!: string;
  public active!: boolean;
  inputParkForm!: FormGroup;
  areas: Area[] = [];
  areaFiltered: Area[] = [];
  subscription: Subscription[] = [];
  areaIdList: number[];
  constructor(
    public translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private areaManagementService: AreaManagementService) {

    this.idPark = this.router.getCurrentNavigation()?.extras.state?.['idPark'] as number;
    this.namePark = this.router.getCurrentNavigation()?.extras.state?.['namePark'] as string;
    this.address = this.router.getCurrentNavigation()?.extras.state?.['addressPark'] as string;
    this.location = this.router.getCurrentNavigation()?.extras.state?.['localityPark'] as string;
    this.cap = this.router.getCurrentNavigation()?.extras.state?.['capPark'] as string;
    this.country = this.router.getCurrentNavigation()?.extras.state?.['countryPark'] as string;
    this.active = this.router.getCurrentNavigation()?.extras.state?.['active'] as boolean;
    this.areaIdList = this.router.getCurrentNavigation()?.extras.state?.['areaIdList'] as number[];
  }

  ngOnInit(): void {
    this.getAreas();
    this.inputParkForm = this.formBuilder.group({
      ctrlParkName: [this.namePark, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkAddress: [this.address, [Validators.required, Validators.pattern('[a-zA-Z0-9\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkLocation: [this.location, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCAP: [this.cap, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlParkCountry: [this.country, [Validators.required, Validators.pattern('[a-zA-Z\u00C0-\u00FF\u0027 ]*')]],
      ctrlAreaIdList: [this.areaIdList, [Validators.required]]
    });
  }

  private getAreas(): void {
    const keyword = "";
    const isActive = true;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe((res) => {
      this.areas = res;
      this.areaFiltered = this.areas.slice();

    }));
  }
}
