import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParkManagementService } from 'src/app/service/park-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Park } from '../domain/class';

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

  constructor(
    private parkingService: ParkManagementService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.search = this.formBuilder.group({
      ctrlSearch: [''],
      ctrlActive: [true]
    });
    this.callGetAPI();
  }

  public callGetAPI(): void {
    const keyword = this.search.get('ctrlSearch')?.value;
    this.parkingService.getParking(keyword).subscribe(
      (park) => (
        this.dataSource.data = park,
        this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
      )
    );
  }

}
