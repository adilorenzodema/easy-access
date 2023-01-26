import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-gate',
  templateUrl: './title-gate.component.html',
  styles: [
  ]
})
export class TitleGateComponent {
  @Input() idPark!: number;
  @Input() namePark!: string;
  constructor() { }


}
