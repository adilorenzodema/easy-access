import { Component, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { Area } from '../domain/class';
//import { areaMokup } from 'src/app/service/mokup/mokup';
import { PermissionService } from 'src/app/service/permission.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { ModalFormAreaComponent } from './modal-form-area/modal-form-area.component';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrls: ['./area-management.component.css']
})
export class AreaManagementComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['idArea', 'areaName', 'creationUser', 'creationDate', 'modificationUser', 'modificationDate', 'action'];
  public dataSource = new MatTableDataSource<Area>();
  public search!: FormGroup;
  public complete = true;
  //public areaMokup: Area[] = areaMokup;
  public areaName!: string;
  private subscription: Subscription[] = [];

  constructor(
    private areaManagementService: AreaManagementService,
    private permissionService: PermissionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: ['']
    });
    this.callGetAPI();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public addEdit(element?: Area): void {
    const dialogRef = this.dialog.open(ModalFormAreaComponent, { width: '40%', height: '50%', data: element ? element : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public onDelete(areaId: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: { title: "Cancellazione Area", content: "Desisderi cancellare l'area selezionata?" },
        autoFocus: false
      }
    );
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
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    this.subscription.push(this.areaManagementService.getAreaList(keyword).subscribe({
      next: areas => {
        this.dataSource.data = areas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  private getPermissionAPI(): void {
    const currentUrl = (window.location.pathname).replace('/', '');
    this.subscription.push(this.permissionService.getPermissionPage(currentUrl).subscribe(
      resp => console.log(resp)
    ));
  }


}




