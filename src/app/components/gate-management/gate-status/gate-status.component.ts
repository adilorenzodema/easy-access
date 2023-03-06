import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Gate, Incident } from 'src/app/domain/interface';
import { GateService } from 'src/app/service/gate-management.service';

@Component({
  selector: 'app-gate-status',
  templateUrl: './gate-status.component.html',
  styleUrls: ['./gate-status.component.css']
})
export class GateStatusComponent implements OnInit {
  public gate: Gate;
  public displayedColumns: string[] = ['startDate', 'endDate', 'errorCode', 'errorMessage'];
  public dataSource = new MatTableDataSource<Incident>();

  constructor(
    private router: Router,
    private gateService: GateService
  ) {
    this.gate = this.router.getCurrentNavigation()?.extras.state?.['gate'] as Gate;
    if (!this.gate) { this.router.navigate(['/gate-management']); }
  }

  ngOnInit(): void {
    this.gateIncidentApi();
  }

  gateIncidentApi(): void {
    this.gateService.getGateIncident(this.gate.idGate).subscribe(
      (incidents) => this.dataSource.data = incidents
    );
  }

}
