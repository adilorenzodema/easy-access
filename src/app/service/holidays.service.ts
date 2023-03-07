import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Calendar } from '../domain/class';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private apiURL = this.beUrl + 'calendarmanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getCalendar(startDate: string, endDate: string): Observable<Calendar[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), startDate, endDate })
    };
    return this.http.get<Calendar[]>(this.apiURL + '/getHolidays' ,options)
      .pipe(catchError(err => { throw err; }));
  }

  addCalendar(calendar: Calendar[]): Observable<Calendar[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Calendar[]>(this.apiURL + '/addCalendar', calendar, options)
      .pipe(catchError(err => { throw err; }));
  }
}
