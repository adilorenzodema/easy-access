import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { AddEditTypePermission } from '../domain/class';
import { PermissionType } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class PermissionTypeManagementService {

  private apiURL = this.beUrl + 'permissiontypemanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getPermissionType(keyword: string, isActive: boolean): Observable<PermissionType[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), name: keyword, active: isActive })
    };
    return this.http.get<PermissionType[]>(this.apiURL + '/getAllPermissionTypes', options)
      .pipe(catchError(err => { throw err; }));
  }

  addPermissionType(permissionType: AddEditTypePermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addPermissionType', permissionType, options)
      .pipe(catchError(err => { throw err; }));
  }

  editPermissionType(permissionType: AddEditTypePermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/editPermissionType/${permissionType.idPermissionType}`, permissionType, options)
      .pipe(catchError(err => { throw err; }));
  }

  disactivatePermissionType(idPermissionType: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/disactivatePermissionType/${idPermissionType}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  activePermissionType(idPermissionType: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/activatePermissionType/${idPermissionType}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  deletePermissionType(idPermissionType: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/deletePermissionType/${idPermissionType}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }
}
