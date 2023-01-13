import { Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Menu } from 'src/app/components/domain/interface';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: Menu[] = [];
  constructor(
    private cookieService: CookieService,
    @Inject('header') public header: any) { }

  ngOnInit(): void {
    this.menuItems = (JSON.parse(this.cookieService.get('Menu')) as Menu[]);
  }

}
