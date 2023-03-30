import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { AddDailyPermission, AddPermanentPermission, AddTemporaryPermission } from '../domain/class';
import { Permission } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class PermissionManagementService {

  private apiURL = this.beUrl + 'permissionmanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getPermission(startDate: string, endDate: string, isActive: boolean, obuKeyword: string, permissionTypeKeyword: string): Observable<Permission[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams(
        { token: Cookie.getToken(this.cookieService), startDate, endDate, active: isActive, obuKeyword, permissionTypeKeyword }
      )
    };
    return this.http.get<Permission[]>(this.apiURL + '/getAllPermissions', options)
      .pipe(catchError(err => { throw err; }));
  }

  addTemporaryPermission(tempPermission: AddTemporaryPermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addTemporaryPermission', tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  addPermanentPermission(tempPermission: AddPermanentPermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addPermanentPermission', tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  addDailyPermission(dailyPermission: AddDailyPermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addDailyPermission', dailyPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  editTemporaryPermission(tempPermission: AddTemporaryPermission, idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editTemporaryPermission/' + idPermission, tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  editPermanentPermission(tempPermission: AddPermanentPermission, idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editPermanentPermission/' + idPermission, tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  editDailyPermission(tempPermission: AddPermanentPermission, idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editDailyPermission/' + idPermission, tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  disactivatePermission(idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/deletePermission/${idPermission}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  activePermission(idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/activatePermission/${idPermission}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }
}
