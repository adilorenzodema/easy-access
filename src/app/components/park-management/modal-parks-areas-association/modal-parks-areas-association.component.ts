import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Area } from 'src/app/domain/class';
import { ParkManagementService } from 'src/app/service/park-management.service';

@Component({
  selector: 'app-modal-parks-areas-association',
  templateUrl: './modal-parks-areas-association.component.html',
  styleUrls: ['./modal-parks-areas-association.component.css']
})
export class ModalParksAreasAssociationComponent implements OnInit {
  public areas: Area[] = [];
  public viewMode = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: number,
    public parkManageService: ParkManagementService
  ) {
  }

  ngOnInit(): void {
    this.apiGetAssociatedParkArea();
  }

  private apiGetAssociatedParkArea(): void {
    console.log("entro nella get")
    this.parkManageService.getAssociateAreaPark(this.data).subscribe(
      (areas) => (this.areas = areas)
    );
  }

}
