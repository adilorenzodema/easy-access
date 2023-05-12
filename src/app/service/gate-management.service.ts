import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { AddEditGate } from '../domain/class';
import { Gate, Incident } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class GateService {

  private apiURL = this.beUrl + 'gatemanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  /**
   * Prende la lista di varchi che rispettano i filtri selezionati richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * parkKeyword. gateKeyword, isActive e token passati compe parametri
   *
   * @param parkKeyword
   * @param gateKeyword
   * @param isActive
   * @returns Observable<Gate[]>
   */
  getAllGates(parkKeyword: string, gateKeyword: boolean, isActive: boolean): Observable<Gate[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), parkKeyword: parkKeyword, gateKeyword: gateKeyword, active: isActive })
    };
    return this.http.get<Gate[]>(this.apiURL + '/getAllGates', options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Prende tutti i varchi associati a un parcheggio richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * idPark passato come path param
   * tokem come parametro
   *
   * @param idPark
   * @returns
   */
  getGateByPark(idPark: number): Observable<Gate[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Gate[]>(this.apiURL + '/getGatesByIdPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Aggiungi un varco richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * addGate nel body
   * token come parametro
   *
   * @param addGate
   * @returns Observable<AddEditGate>
   */
  addGate(addGate: AddEditGate): Observable<AddEditGate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<AddEditGate>(this.apiURL + '/addGate', addGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica di un varco richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * token passato come parametro
   * editGate passato nel body
   *
   * @param editGate
   * @returns Observable<AddEditGate>
   */
  editGate(editGate: AddEditGate): Observable<AddEditGate> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<AddEditGate>(this.apiURL + '/editGate', editGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disattiva varco richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * token come parametro
   * idGate come path param
   *
   * @param idGate
   * @returns
   */
  disactivateGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/disactivateGate/' + idGate, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ri-attiva un varco richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * idGate passato come path param
   *
   * @param idGate
   * @returns Observable<void>
   */
  activateGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activateGate/' + idGate, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Elimina vaco richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * idGate come path param
   * token come parametro
   *
   * @param idGate
   * @returns Observable<void>
   */
  deleteGate(idGate: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deleteGate/' + idGate, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni lista alert (incident) di un varco richiamando le API fornite da bacneknd (GestioneVarcoRestController)
   * idGate come path param
   * token come parametro
   *
   * @param idGate
   * @returns Observable<Incident[]>
   */
  getGateIncident(idGate: number): Observable<Incident[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Incident[]>(this.apiURL + '/getGateIncidents/' + idGate, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Restituisci oggetto di tipo Gate passanto id come path param
   *
   * @param gateId
   * @returns
   */
  getGateById(gateId: number): Observable<Gate>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };

    return this.http.get<Gate>(this.apiURL + '/getGateById/' +gateId, options);
  }
}
