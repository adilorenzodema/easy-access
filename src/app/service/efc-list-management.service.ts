import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { EFC } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class EfcListManagementService {

  private apiURL = this.beUrl + 'efcmanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getEfcList(keyword: string): Observable<EFC[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword })
    };
    return this.http.get<EFC[]>(this.apiURL + '/getEfc', options)
      .pipe(catchError(err => { throw err; }));
  }

  deleteArea(efcCode: String): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deactivateEfc/' + efcCode, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  activateArea(efcCode: String): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activateEfc/' + efcCode, null, options)
      .pipe(catchError(err => { throw err; }));
  }

}
