import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of } from 'rxjs';
import { LoginUser } from '../components/domain/class';
import { UserPermission } from '../components/domain/interface';
import { HttpUtils } from '../shared/utils/httpUtils';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loginUser!: UserPermission;
  private noAuthURL = "http://localhost:8080/noAuth";
  private apiURL = "http://localhost:8080/auth";


  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }

  login(loginUser: LoginUser): Observable<UserPermission> {
    return this.http.post<UserPermission>(this.noAuthURL + '/login', loginUser)
      .pipe(catchError(err => { throw err; }));
  }

  logout(): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<void>(this.apiURL + '/logout', null, options)
      .pipe(catchError(err => { throw err; }));
  }

  refreshToken(): Observable<UserPermission> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<UserPermission>(this.noAuthURL + '/refreshToken', { refreshToken: this.getRefreshToken() }, options)
      .pipe(catchError(err => { throw err; }));
  }

  sendMailResetPassword(mail: string): Observable<void> {
    return this.http.post<void>(this.noAuthURL + '/sendEmailResetPassword', { email: mail })
      .pipe(catchError(err => { throw err; }));
  }

  resetPassword(token: string, password: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: token })
    };
    return this.http.post<void>(this.apiURL + '/resetPassword', { newPassword: password }, options)
      .pipe(catchError(err => { throw err; }));
  }

  changePassword( newPassword: string, oldPassword: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<void>(this.apiURL + '/changePassword',  {newPassword: newPassword, oldPassword: oldPassword} , options)
      .pipe(catchError(err => { throw err; }));
  }

  getPermissionPage(menuItemKey: string): Observable<any> {
    const token = this.getToken();
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token, menuItemKey })
    };
    return this.http.post<any>(this.apiURL + '/getPagePermissions', null, options)
      .pipe(catchError(err => { throw err; }));
  }

  private getToken(): string {
    return JSON.parse(this.cookieService.get('Token'));
  }

  private getRefreshToken(): string {
    return JSON.parse(this.cookieService.get('RefreshToken'));
  }
}
