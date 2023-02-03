import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-modal-aree-users-association',
  templateUrl: './modal-aree-users-association.component.html',
  styles: [``]
})
export class ModalAreeUsersAssociationComponent implements OnInit {
  public users: UserAssociated[] = [];
  public usersGranted: UserAssociated[] = [];
  public selectedUser: UserAssociated[] = [];
  public viewModeUser = true;

  constructor(
    public dialogRef: MatDialogRef<ModalAreeUsersAssociationComponent>,
    private areaManageService: AreaManagementService,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) { }

  ngOnInit(): void {
    this.apiGetAssociateUserArea();
  }

  public saveAssociation(): void {
    // console.log(this.selectedUser, this.usersGranted);
    this.areaManageService.editAssociateUserArea(this.data, this.selectedUser).subscribe(
      () => this.dialogRef.close()
    );
  }

  private apiGetAssociateUserArea(): void {
    this.areaManageService.getAssociateUserArea(this.data).subscribe(
      (users) => (
        this.users = users,
        users.forEach(
          (user) => { if (user.granted) this.usersGranted.push(user); }
        )
      )
    );
  }
}
