import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { AddGate } from '../domain/class';
import { Gate } from '../domain/interface';
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

  getAllGates(parkKeyword: string, gateKeyword: boolean, isActive: boolean): Observable<Gate[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), parkKeyword: parkKeyword, gateKeyword: gateKeyword, active: isActive })
    };
    return this.http.get<Gate[]>(this.apiURL + '/getAllGates', options)
      .pipe(catchError(err => { throw err; }));
  }

  getGateByPark(idPark: number): Observable<Gate[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Gate[]>(this.apiURL + '/getGatesByIdPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }

  addGate(addGate: AddGate): Observable<AddGate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<AddGate>(this.apiURL + '/addGate', addGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  editGate(editGate: AddGate): Observable<AddGate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<AddGate>(this.apiURL + '/editGate', editGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  deleteGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deleteGate/' + idGate, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  activateGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activateGate/' + idGate, null, options)
      .pipe(catchError(err => { throw err; }));
  }
}
