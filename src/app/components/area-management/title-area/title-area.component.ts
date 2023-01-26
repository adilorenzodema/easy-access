import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-area',
  templateUrl: './title-area.component.html',
  styles: [
  ]
})
export class TitleAreaComponent {

  @Input() idPark!: number;
  @Input() namePark!: string;
  constructor() { }

}
