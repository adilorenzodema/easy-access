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
    private translateService: TranslateService,
    @Inject('domainValue') private domain: Domains) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang(`it-${this.domain}`);
    this.translateService.addLangs([`it-${this.domain}`, `en-${this.domain}`]);
    this.translateService.use(`it-${this.domain}`);
  }
}
