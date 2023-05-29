import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError } from 'rxjs';
import { PermissionInterporto } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';
import { AddDailyPermissionInterporto, AddTemporaryPermission, AddTemporaryPermissionInterporto } from '../domain/class';

@Injectable({
  providedIn: 'root'
})
export class PermissionInterportoManagementService {

  private apiURL = this.beUrl + 'permissioninterportomanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }
   /**
     * Prende la lista di permessi che rispettano il filtro dei valori passati dalle API fornite da backend (GestionePermessoRestController)
     * Tutti i dati vengono passati come parametri
     *
     * @param startDate
     * @param endDate
     * @param isActive
     * @param obuKeyword
     * @param permissionTypeKeyword
     * @param idArea
     * @param category
     * @returns
     */
   getPermission(startDate: string, endDate: string, isActive: boolean, obuKeyword: string, license: string,permissionTypeKeyword: string,
    idPark: number, category: string): Observable<PermissionInterporto[]>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams(
        { token: Cookie.getToken(this.cookieService), startDate, endDate, active: isActive, obuKeyword, license ,permissionTypeKeyword, idPark, category }
      )
    };
    return this.http.get<PermissionInterporto[]>(this.apiURL + '/getAllPermissions', options)
      .pipe(catchError(err => { throw err; }));
  }

  addTemporaryPermission(tempPermission: AddTemporaryPermissionInterporto): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addTemporaryPermission', tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  addDailyPermission(dailyPermission: AddDailyPermissionInterporto): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addDailyPermission', dailyPermission, options)
      .pipe(catchError(err => { throw err; }));
  }
}
