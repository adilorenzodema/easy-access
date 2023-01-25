import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-park',
  templateUrl: './title-park.component.html',
  styleUrls: ['./title-park.component.css']
})
export class TitleParkComponent {
  @Input() idArea!: number;
  @Input() areaName!: string;
  constructor() { }

}
