import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Park } from '../domain/class';
import { ModalFormParkComponent } from './modal-form-park/modal-form-park.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormConfirmComponent } from 'src/app/shared/components/modal-form-confirm/modal-form-confirm.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AreaManagementComponent } from '../area-management/area-management.component';
import { state } from '@angular/animations';


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
    const keyword = this.search.get('ctrlSearch')?.value;
    this.parkingService.getParking(keyword).subscribe(
      (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort,
        console.log(park)
      )
    );
  }

  public callGetAPIFiltered(): void {
    const keyword = this.search.get('ctrlSearch')?.value;
    this.parkingService.getParkingById(keyword, this.idArea).subscribe(
      (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort,
        console.log(park)
      )
    );
  }

  public addEditPark(park?: Park): void {
    const dialogRef = this.dialog.open(ModalFormParkComponent, { width: '40%', height: '50%', data: park ? park : '' });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) { this.callGetAPI(); };
      }
    );
  }

  public deletePark(parkId: number): void {
    const dialogRef = this.dialog.open(ModalFormConfirmComponent,
      {
        width: '40%', height: '50%', data: { title: "Cancellazione parcheggio", content: "Desisderi cancellare il parcheggio selezionato?" }
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
