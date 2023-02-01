import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Park } from '../../domain/class';
import { ModalFormParkComponent } from './modal-form-park/modal-form-park.component';


@Component({
  selector: 'app-park-management',
  templateUrl: './park-management.component.html',
  styleUrls: ['./park-management.component.css']
})
export class ParkManagementComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public search!: FormGroup;
  public dataSource = new MatTableDataSource<Park>();
  public displayedColumns: string[] = ['idParcheggio', 'nomeParcheggio', 'indirizzo', 'modificationDate', 'action'];
  public areaName: string;
  public idArea!: number;
  public complete = true;
  private subscription: Subscription[] = [];


  constructor(
    private parkingService: ParkManagementService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.idArea = this.router.getCurrentNavigation()?.extras.state?.['idArea'] as number;
    this.areaName = this.router.getCurrentNavigation()?.extras.state?.['areaName'] as string;
  }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    if (this.idArea) {
      this.callGetAPIFiltered();
    } else {
      this.callGetAPI();
    }
  }

  public callGetAPI(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    const isActive = this.search.get('ctrlActive')?.value;
    this.parkingService.getParking(keyword, isActive).subscribe({
      next: (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public callGetAPIFiltered(): void {
    this.complete = false;
    const keyword = this.search.get('ctrlSearch')?.value;
    this.parkingService.getParkingById(keyword, this.idArea).subscribe({
      next: (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      ),
      error: () => this.complete = true,
      complete: () => this.complete = true
    });
  }

  public addEditPark(park?: Park): void {
    const dialogRef = this.dialog.open(ModalFormParkComponent, { width: '40%', height: '65%', data: park ? park : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.idArea ? this.callGetAPIFiltered() : this.callGetAPI(); };
      }
    );
  }

  public deletePark(parkId: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '30%', height: '30%',
        data: {
          title: "Cancellazione parcheggio", content: "Desisderi cancellare il parcheggio selezionato?"
        },
        autoFocus: false
      }
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.subscription.push(this.parkingService.deletePark(parkId).subscribe(
            () => this.callGetAPI()
          ));
        }
      });
  }

}
