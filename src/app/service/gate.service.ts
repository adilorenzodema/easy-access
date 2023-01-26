import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Gate } from '../components/domain/class';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class GateService {

  private apiURL = this.beUrl + 'gatemanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getAllGates(): Observable<Gate[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Gate[]>(this.apiURL + '/getAllGates', options)
      .pipe(catchError(err => { throw err; }));
  }

  addGate(gate: Gate): Observable<Gate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Gate>(this.apiURL + '/addGate', gate, options)
      .pipe(catchError(err => { throw err; }));
  }

  editGate(gate: Gate): Observable<Gate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Gate>(this.apiURL + '/editGate', gate, options)
      .pipe(catchError(err => { throw err; }));
  }

  deleteGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.delete<void>(this.apiURL + '/deleteGate/' + idGate, options)
      .pipe(catchError(err => { throw err; }));
  }
}
