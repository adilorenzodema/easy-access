import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TransitService } from 'src/app/service/transit-management.service';
import { Transit } from '../domain/interface';

@Component({
  selector: 'app-transit',
  templateUrl: './transit.component.html',
  styles: [
  ]
})
export class TransitComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['idTransito', 'codiceObu'];
  public dataSource = new MatTableDataSource<Transit>();
  public complete = true;

  private subscription: Subscription[] = [];

  constructor(private transitService: TransitService) { }

  ngOnInit(): void {
    this.callGetAPI();
  }

  public callGetAPI(): void {
    this.complete = false;
    this.subscription.push(this.transitService.getTransitList().subscribe({
      next: transit => {
        this.dataSource.data = transit;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.complete = true,
      complete: () => this.complete = true
    }));
  }

}
