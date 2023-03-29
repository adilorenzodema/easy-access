import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { AddEditGate } from '../domain/class';
import { Gate, Incident } from '../domain/interface';
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

  addGate(addGate: AddEditGate): Observable<AddEditGate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<AddEditGate>(this.apiURL + '/addGate', addGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  editGate(editGate: AddEditGate): Observable<AddEditGate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<AddEditGate>(this.apiURL + '/editGate', editGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  disactivateGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/disactivateGate/' + idGate, null, options)
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

  getGateIncident(idGate: number): Observable<Incident[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Incident[]>(this.apiURL + '/getGateIncidents/' + idGate, options)
      .pipe(catchError(err => { throw err; }));
  }
}
