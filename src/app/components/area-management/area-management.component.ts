import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import { User } from '../domain/class';
import { MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrls: ['./area-management.component.css']
})
export class AreaManagementComponent implements OnInit,OnDestroy {
  @ViewChild('paginator') paginator!: MatPaginator ;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['areaId', 'areaName', 'action'];
  public dataSource = new MatTableDataSource<User>();
  public search!: FormGroup;
  private subscription: Subscription[] = [];

  constructor(
    private userManagementService: UserManagementService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public addUser(): void {
   /*  const dialogRef = this.dialog.open(ModalFormUserComponent, { width: '40%', height: '50%', data:"" });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    ); */
  }

  public onEdit(element: Element): void {
   /*  const dialogRef = this.dialog.open(ModalFormUserComponent, { width: '40%', height: '50%', data: element });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    ); */
  }

  public onDelete(userId: number): void {
    /* const dialogRef = this.dialog.open(ModalFormConfirmComponent, { width: '40%', height: '50%', data:{isDelete:true}});
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.userManagementService.deleteUser(userId).subscribe(
            () => this.callGetAPI()
          ));
        }
      }); */
  }

  public onActivate(userId: number): void {
   /*  const dialogRef = this.dialog.open(ModalFormConfirmComponent, { width: '40%', height: '50%', data:{isDelete:false} });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.userManagementService.activateUser(userId).subscribe(
            () => this.callGetAPI()
          ));
        }
      }); */
  }

  public callGetAPI(): void {
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.userManagementService.getUserList(keyword, isActive).subscribe(
      users => {this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;}
    ));
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.pathname).replace('/', '');
    this.subscription.push(this.authService.getPermissionPage(currentUrl).subscribe(
      resp => console.log(resp)
    ));
  }


}




