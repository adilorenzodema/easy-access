import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class Cookie {

  constructor() { }

  static getToken(cookieService: CookieService): string {
    return cookieService.get('Token');;
  }
}
