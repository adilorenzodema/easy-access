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

  /**
   * Ottieni lista di efc richiamando le API fornite da bacneknd (GestioneEfcRestController)
   * efcCode e token come parametri
   *
   * @param efcCode
   * @returns
   */
  getEfcList(efcCode: string): Observable<EFC[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), efcCode: efcCode })
    };
    return this.http.get<EFC[]>(this.apiURL + '/getEfc', options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disattiva efc richiamando le API fornite da bacneknd (GestioneEfcRestController)
   * token come parametro
   * efcCode come path param
   *
   * @param efcCode
   * @returns Observable<void>
   */
  deactivateEfc(efcCode: String): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/disactivateEfc/' + efcCode, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ri-attiva efc richiamando le API fornite da bacneknd (GestioneEfcRestController)
   * token passato coma parametro
   * efcCode come path param
   *
   * @param efcCode
   * @returns
   */
  activateEfc(efcCode: String): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activateEfc/' + efcCode, null, options)
      .pipe(catchError(err => { throw err; }));
  }

}
