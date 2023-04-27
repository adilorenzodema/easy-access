import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { ErrorCode, Incident } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class IncidentsManagementService {
  private apiURL = this.beUrl + 'incidentmanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  /*
    * Prende la lista degli incidenti
    *
    * @param {string} startDate
    * @param {string} endDate
    * @param {string} gateName
    * @param {string} parkName
    * @param {string} device
    * @param {string} errorCode
    * @param {boolean} status
    * @returns {Observable<Incident[]>}
  * */
  getIncidentsList(
    startDate: string,
    endDate: string,
    gateName: string,
    parkName: string,
    device: string,
    errorCode: string,
    status: boolean): Observable<Incident[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({
        token: Cookie.getToken(this.cookieService),
        startDate, endDate, gateName, parkName, device, errorCode, status
      })
    };
    return this.http.get<Incident[]>(this.apiURL + '/getAllIncidents', options)
      .pipe(catchError(err => { throw err; }));
  }

  /*
   * Prende lista dei codici di errore
   *
   * @returns {Observable<String[]>}
  * */
  getAllErrorCodes(): Observable<ErrorCode[]>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({
        token: Cookie.getToken(this.cookieService)
      })
    };

    return this.http.get<ErrorCode[]>(this.apiURL + "/getAllCodeErrors", options);
  }
}
