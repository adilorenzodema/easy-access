import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { Area } from '../domain/class';
import { MatSort} from '@angular/material/sort';
import { AreaManagementService } from 'src/app/service/area-management.service';
//import { areaMokup } from 'src/app/service/mokup/mokup';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area/modal-form-area.component';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrls: ['./area-management.component.css']
})
export class AreaManagementComponent implements OnInit,OnDestroy {
  @ViewChild('paginator') paginator!: MatPaginator ;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['idArea', 'nomeArea','creationUser','creationDate','modificationUser','modificationDate', 'action'];
  public dataSource = new MatTableDataSource<Area>();
  public search!: FormGroup;
  //public areaMokup: Area[] = areaMokup;
  private subscription: Subscription[] = [];

  constructor(
    private areaManagementService: AreaManagementService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    //console.log(areaMokup);
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public addArea(): void {
  const dialogRef = this.dialog.open(ModalFormAreaComponent, { width: '40%', height: '50%', data:"" });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public onEdit(element: Element): void {
    const dialogRef = this.dialog.open(ModalFormAreaComponent, { width: '40%', height: '50%', data: element });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public onDelete(areaId: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent, { width: '40%', height: '50%', data:{isDelete:true}});
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.areaManagementService.deleteArea(areaId).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

  public callGetAPI(): void {
      const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.areaManagementService.getAreaList(keyword).subscribe(
      areas => {this.dataSource.data = areas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.data);}
    ));

    /*  this.dataSource.data = areaMokup;
    console.log("data" + this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; */
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.pathname).replace('/', '');
    this.subscription.push(this.authService.getPermissionPage(currentUrl).subscribe(
      resp => console.log(resp)
    ));
  }


}




