import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Park } from '../components/domain/class';

@Injectable({
  providedIn: 'root'
})
export class ParkManagementService {
  private apiURL = 'http://localhost:8080/api/easyaccess/gestioneparcheggio';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getParking(keyword: string): Observable<Park[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken(), keyword: keyword })
    };
    return this.http.get<Park[]>(this.apiURL + '/getParcheggi', options)
      .pipe(catchError(err => { throw err; }));
  }

  private getToken(): string {
    return this.cookieService.get('Token');
  }
}
