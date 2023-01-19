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
  private noAuthURL = "http://localhost:8080";
  private apiURL = "http://localhost:8080/auth";


  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }

  refreshToken(): Observable<UserPermission> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<UserPermission>(this.noAuthURL + '/authRefresh/refreshToken', { refreshToken: this.getRefreshToken() }, options)
      .pipe(catchError(err => { throw err; }));
  }

  private getToken(): string {
    return this.cookieService.get('Token');
  }

  private getRefreshToken(): string {
    return this.cookieService.get('RefreshToken');
  }
}
