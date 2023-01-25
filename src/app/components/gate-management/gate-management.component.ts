import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { GateService } from 'src/app/service/gate.service';
import { Gate } from '../domain/class';

@Component({
  selector: 'app-gate-management',
  templateUrl: './gate-management.component.html',
  styleUrls: ['./gate-management.component.css']
})
export class GateManagementComponent implements OnInit {
  public displayedColumns: string[] = ['idGate', 'gateName', 'action'];
  public dataSource = new MatTableDataSource<Gate>();

  private subscription: Subscription[] = [];

  constructor(private gateService: GateService) { }

  ngOnInit(): void {
    this.callGetAPI();
  }

  public callGetAPI(): void {
    this.subscription.push(this.gateService.getAllGates().subscribe(
      (gates) => this.dataSource.data = gates
    ));
  }
}
