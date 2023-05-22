import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Domains } from './domain/interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang('it');
    this.translateService.addLangs(['it', 'en']);
    this.translateService.use('it');
  }
}
