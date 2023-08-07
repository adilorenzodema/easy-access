import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Calendar } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private apiURL = this.beUrl + 'calendarmanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string,
    @Inject('loginTitle') private loginTitle) { }

    /**
     * Prende le vacanze selezionate in un intervallo di date richiamando le API fornite da backend (GestioneCalendarioRestController)
     * startDate, endDate e toke dell'utente sono passati come parametri
     *
     * @param startDate
     * @param endDate
     * @returns Observable<Calendar[]>
     */
  getCalendar(startDate: string, endDate: string): Observable<Calendar[]> {
    console.log("loginne preso da config.app ",this.loginTitle)

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), startDate , endDate })
    };
    return this.http.get<Calendar[]>(this.apiURL + '/getHolidays' ,options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Aggiunge le vacanze scelte all'anno selezionato
   * year passato coma path param
   * calendar passato nel body
   * token dell'utente passato come parametro
   * @param calendar
   * @param year
   * @returns Observable<Date[]>
   */
  addCalendar(calendar: Date[], year: number): Observable<Date[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Date[]>(this.apiURL + '/addCalendar/' + year, calendar, options)
      .pipe(catchError(err => { throw err; }));
  }
}
