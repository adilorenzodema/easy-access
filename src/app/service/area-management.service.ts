import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of } from 'rxjs';
import { Area } from '../domain/class';
import { ParkAssociated, UserAssociated } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class AreaManagementService {
  private apiURL = this.beUrl + 'areamanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  /**
   * Ottieni una lista di oggetti Area che rispettano i filtri selezionati richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * token, keyword e isActive come parametri
   *
   * @param keyword
   * @param isActive
   * @returns Observable<Area[]>
   */
  getAreaList(keyword: string, isActive: boolean): Observable<Area[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword, active: isActive })
    };
    return this.http.get<Area[]>(this.apiURL + '/getAreas', options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Otieni un oggetto di tipo Area con l'id corrispondente richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea come path param
   * token come parametro
   *
   * @param idArea
   * @returns Observable<Area>
   */
  getAreaByIdArea(idArea: number): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService)})
    };
    return this.http.get<Area>(this.apiURL + '/getAreaByIdArea/' + idArea, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni tutte le area alle quali è associato il parcheggio con quell'id richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idPArk come path param
   * toke come parametro
   *
   * @param idPark
   * @returns  Observable<Area[]>
   */
  getAreasByIdPark(idPark: number): Observable<Area[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Area[]>(this.apiURL + '/getAreasByIdPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni la lista di utenti associati a un area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea passato come path param
   * token come parametro
   *
   * @param idArea
   * @returns Observable<UserAssociated[]>
   */
  getAssociateUserArea(idArea: number): Observable<UserAssociated[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<UserAssociated[]>(this.apiURL + '/getAssociateUserArea/' + idArea, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica lista di utenti associati ad un area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea come path param
   * users nel body
   * token come parametro
   *
   * @param idArea
   * @param users
   * @returns Observable<void>
   */
  editAssociateUserArea(idArea: number, users: UserAssociated[]): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editAssociateUserArea/' + idArea, users, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni lista di oggetti di tipo Park associati ad un area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea path param
   * token come parametro
   *
   * @param idArea
   * @returns Observable<ParkAssociated[]>
   */
  getAssociateParkArea(idArea: number): Observable<ParkAssociated[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<ParkAssociated[]>(this.apiURL + '/getAssociateParkArea/' + idArea, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica lista di parcheggi associati ad un area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea come path param
   * parks nel body
   * token come parametro
   *
   * @param idArea
   * @param parks
   * @returns Observable<void>
   */
  editAssociateParkArea(idArea: number, parks: ParkAssociated[]): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editAssociateParkArea/' + idArea, parks, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Aggiungi un'area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * area nel body
   * token come parametro
   *
   * @param area
   * @returns Observable<Area>
   */
  addArea(area: Area): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Area>(this.apiURL + '/addArea', area, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * area nel body
   * token come parametro
   *
   * @param area
   * @returns Observable<Area>
   */
  editArea(area: Area): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Area>(this.apiURL + '/editArea', area, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disattiva area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea come path param
   * token come parametro
   *
   * @param idArea
   * @returns  Observable<void>
   */
  disactivateArea(idArea: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/disactivateArea/' + idArea, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ri-attiva area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * token come parametro
   * idArea come path param
   *
   * @param idArea
   * @returns Observable<void>
   */
  activateArea(idArea: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activateArea/' + idArea, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Elimina un area richiamando le API fornite da bacneknd (GestioneAreaRestController)
   * idArea come path param
   * token come parametro
   *
   * @param idArea
   * @returns
   */
  deleteArea(idArea: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deleteArea/' + idArea, null, options)
      .pipe(catchError(err => { throw err; }));
  }

}
