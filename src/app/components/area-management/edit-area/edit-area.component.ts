import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public area: Area;
  public formGroup!: FormGroup;
  public users: UserAssociated[] = [];
  public grantedUsers: UserAssociated[] = [];
  public selectedUsers: UserAssociated[] = [];
  public viewModeUser = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private areaManageService: AreaManagementService
  ) {
    this.area = this.router.getCurrentNavigation()?.extras.state?.['area'] as Area;
    if (!this.area) { this.router.navigate(['/area-management']); }
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      ctrlAreaName: [this.area.areaName, Validators.required],
      ctrlCreationDate: [moment(this.area.creationDate).format('DD/mm/YYYY')]
    });
    this.apiGetAssociateUserArea();
  }

  private apiGetAssociateUserArea(): void {
    this.areaManageService.getAssociateUserArea(this.area.idArea).subscribe(
      (users) => (
        this.users = users,
        users.forEach(
          (user) => { if (user.granted) this.grantedUsers.push(user); }
        )
      )
    );
  }

}
