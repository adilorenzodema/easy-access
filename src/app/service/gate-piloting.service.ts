import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { GateStatus } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class GatePilotingService {

  private apiURL = this.beUrl + 'gatecontroller';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getGateInfo(gateId: number): Observable<GateStatus[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<GateStatus[]>(this.apiURL + '/getGateInfo/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  rebootGate(gateId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<void>(this.apiURL + '/rebootGate/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  activateGate(gateId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<void>(this.apiURL + '/activateGate/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  deactivateGate(gateId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<void>(this.apiURL + '/deactivateGate/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  openGate(gateId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<void>(this.apiURL + '/deactivateGate/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  closeGate(gateId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<void>(this.apiURL + '/closeGate/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }

  autoGate(gateId: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<void>(this.apiURL + '/autoGate/' + gateId, options)
      .pipe(catchError(err => { throw err; }));
  }
}
