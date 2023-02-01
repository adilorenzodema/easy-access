import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PagePermissionService } from 'dema-movyon-template';
import { Subscription } from 'rxjs';
import { AreaManagementService } from 'src/app/service/area-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Area } from '../../domain/class';
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
  public idPark: number;
  public namePark: string;
  public areaName!: string;
  private subscription: Subscription[] = [];

  constructor(
    private areaManagementService: AreaManagementService,
    private permissionService: PagePermissionService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router) {
    this.idPark = this.router.getCurrentNavigation()?.extras.state?.['idPark'] as number;
    this.namePark = this.router.getCurrentNavigation()?.extras.state?.['namePark'] as string;
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    if (this.idPark) {
      this.callGetAPIFiltered();
    } else {
      this.callGetAPI();
    }
    this.getPermissionAPI();
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
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.areaManagementService.getAreaList(keyword, isActive).subscribe({
      next: areas => {
        this.dataSource.data = areas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

  public callGetAPIFiltered(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.subscription.push(this.areaManagementService.getAreasByIdPark(this.idPark).subscribe({
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
      resp => null
    ));
  }


}




