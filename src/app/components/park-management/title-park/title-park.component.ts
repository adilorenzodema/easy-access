import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-park',
  templateUrl: './title-park.component.html',
  styleUrls: ['./title-park.component.css']
})
export class TitleParkComponent implements OnInit {
  @Input() idArea!: number;
  @Input() areaName!: string;
  constructor() { }

  ngOnInit(): void {
    console.log(this.idArea);
  }

}
