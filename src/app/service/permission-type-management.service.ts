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

  /**
   * Prende la lista di tipi di permessi PermissionType
   * Dati passati come parametri
   *
   * @param keyword
   * @param isActive
   * @returns Observable<PermissionType[]>
   */
  getPermissionType(keyword: string, isActive: boolean): Observable<PermissionType[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), name: keyword, active: isActive })
    };
    return this.http.get<PermissionType[]>(this.apiURL + '/getAllPermissionTypes', options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Aggiunge un tipo ti permresso richiamando le API fornite dal backend (GestioneTipoPermessoRstController)
   * L'oggetto permissionType è passato nel body della chiamata
   * Il token dell'utente è passato come parametro
   *
   * @param permissionType
   * @returns Observable<void>
   */
  addPermissionType(permissionType: AddEditTypePermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/addPermissionType', permissionType, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica un tipo di permesso richiamando le API fornite dal backend (GestioneTipoPermessoRstController)
   * L'ID del permissionType è passato come path param
   * L'oggetto permissionType è passato nel body
   * Il token dell'utente è passato come parametro
   * @param permissionType
   * @returns Observable<void>
   */
  editPermissionType(permissionType: AddEditTypePermission): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/editPermissionType/${permissionType.idPermissionType}`, permissionType, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disattiva un tipo di permesso richiamando le API fornite dal backend (GestioneTipoPermessoRstController)
   * idPermissionType è passato come path param
   * Il token dell'utente è passato come parametro
   *
   * @param idPermissionType
   * @returns Observable<void>
   */
  disactivatePermissionType(idPermissionType: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/disactivatePermissionType/${idPermissionType}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ri-attiva un tipo di permesso richiamando le API fornite dal backend (GestioneTipoPermessoRstController)
   * idPermissionType è passato come path param
   * Il token dell'utente è passato come parametro
   *
   * @param idPermissionType
   * @returns Observable<void>
   */
  activePermissionType(idPermissionType: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/activatePermissionType/${idPermissionType}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Elimina un tipo di permesso richiamando le API fornite dal backend
   * idPermissionType passato come path param
   * Il token dell'utente è passato come parametro
   *
   * @param idPermissionType
   * @returns Observable<void>
   */
  deletePermissionType(idPermissionType: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + `/deletePermissionType/${idPermissionType}`, null, options)
      .pipe(catchError(err => { throw err; }));
  }
}
