import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
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

  getPermission(startDate: string, endDate: string, obuKeyword?: string, permissionTypeKeyword?: string): Observable<Permission[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), startDate, endDate, obuKeyword, permissionTypeKeyword })
    };
    return this.http.get<Permission[]>(this.apiURL + '/getAllPermissions', options)
      .pipe(catchError(err => { throw err; }));
  }
}
