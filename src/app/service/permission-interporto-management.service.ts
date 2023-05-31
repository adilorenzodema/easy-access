import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError } from 'rxjs';
import { PermissionInterporto } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';
import { AddDailyPermissionInterporto, AddPermanentPermissionInterporto, AddTemporaryPermission, AddTemporaryPermissionInterporto } from '../domain/class';

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

  addPermanentPermission(permPermission: AddPermanentPermissionInterporto): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addPermanentPermission', permPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica un permesso temporaneo richiamando le API fornite dal ackend (GestionePermessoRestController)
   * tempPermission è passato nel body
   * idPermission è passato nel path param
   * il token dell'utente è passato come parametro
   *
   * @param tempPermission
   * @param idPermission
   * @returns Observable<void>
   */
  editTemporaryPermission(tempPermission: AddTemporaryPermissionInterporto, idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editTemporaryPermission/' + idPermission, tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica un permesso permanente richiamando le API fornite dal backend (GestionePermessoRestController)
   * tempPermission è passato nel body
   * idPermission è passato come path param
   * Il token dell'utente è passato come parametro
   *
   * @param tempPermission
   * @param idPermission
   * @returns
   */
  editPermanentPermission(tempPermission: AddPermanentPermissionInterporto, idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editPermanentPermission/' + idPermission, tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica un permesso giornaliero richiamando le API fornite da backend (GestionePermessoRestController)
   * tempPermission passato nel body
   * idPermission passato come path param
   * Token dell'utente passato come parametro
   *
   * @param tempPermission
   * @param idPermission
   * @returns Observable<void>
   */
  editDailyPermission(tempPermission: AddDailyPermissionInterporto, idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editDailyPermission/' + idPermission, tempPermission, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disattiva permesso richiamando le API fornite da backend (GestionePermessoRestController)
   * Token dell'utente passato come parametro
   * idPermission passato come path param
   *
   * @param idPermission
   * @returns Observable<void>
   */
  disactivatePermission(idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/disactivatePermission/${idPermission}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ri-attiva permesso richiamando le API fornite da backend (GestionePermessoRestController)
   * Token dell'utente passato come parametro
   * idPermission passato come path param
   *
   * @param idPermission
   * @returns Observable<void>
   */
  activePermission(idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/activatePermission/${idPermission}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Elimina permesso richiamando le API fornite da backend (GestionePermessoRestController)
   * Token dell'utente passato come parametro
   * idPermission passato come path param
   *
   * @param idPermission
   * @returns Observable<void>
   */
  deletePermission(idPermission: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/deletePermission/${idPermission}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }
}


