import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { SnackBar } from 'dema-movyon-template';
import { UserAssociated } from 'src/app/domain/interface';
import { AreaManagementService } from 'src/app/service/area-management.service';

@Component({
  selector: 'app-modal-aree-users-association',
  templateUrl: './modal-aree-users-association.component.html',
  styles: [``]
})
export class ModalAreeUsersAssociationComponent implements OnInit {
  public users: UserAssociated[] = [];
  public grantedUsers: UserAssociated[] = [];
  public selectedUsers: UserAssociated[] = [];
  public viewModeUser = true;
  public complete = true;

  constructor(
    public dialogRef: MatDialogRef<ModalAreeUsersAssociationComponent>,
    private areaManageService: AreaManagementService,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) { }

  ngOnInit(): void {
    this.apiGetAssociateUserArea();
  }

  public saveAssociation(): void {
    this.complete = false;
    this.selectedUsers.forEach(
      (selectedUser) => { if (!selectedUser.granted) selectedUser.granted = true; }
    );
    this.areaManageService.editAssociateUserArea(this.data, this.selectedUsers).subscribe({
      error: () => (this.complete = true, this.selectedUsers = this.grantedUsers, this.snackBar.showMessage('errore nell`associazione', "ERROR")),
      complete: () => (this.complete = true, this.dialogRef.close(), this.snackBar.showMessage('associazione eseguita con successo', "INFO"))
    });
  }

  private apiGetAssociateUserArea(): void {
    this.areaManageService.getAssociateUserArea(this.data).subscribe(
      (users) => (
        this.users = users,
        users.forEach(
          (user) => { if (user.granted) this.grantedUsers.push(user); }
        )
      )
    );
  }
}
