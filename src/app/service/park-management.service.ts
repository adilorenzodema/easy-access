import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Area, Park } from '../domain/class';
import { AreaAssociated, GateAssociated, ParkStatus } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class ParkManagementService {
  private apiURL = this.beUrl + 'parkmanagement';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  /**
     * Prende una lista di parchegggi Park dalle API fornite da backend (GestioneParcheggioRestController)
     * keyword, isActive e idArea passati come parametri
     *
     * @param keyword
     * @param isActive
     * @param idArea
     * @returns Observable<Park[]>
     */
  getParking(keyword: string, isActive: boolean, idArea :number): Observable<Park[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword, active: isActive, idArea: idArea })
    };
    return this.http.get<Park[]>(this.apiURL + '/getParks', options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni lista dele aree associate a un parcheggio dalle API fornite da backend (GestioneParcheggioRestController)
   * idPark è passato come path param
   *
   * @param idPark
   * @returns <AreaAssociated[]>
   */
  getAssociateAreaPark(idPark: number): Observable<AreaAssociated[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<AreaAssociated[]>(this.apiURL + '/getAssociateAreaPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }


  /**
   * Prende lista di aprcheggi Park associati ad un area dalle API fornite da backend (GestioneParcheggioRestController)
   * keyowrd e token dell'utente passati coem parametri
   * idArea passato come path param
   *
   * @param keyword
   * @param idArea
   * @returns Observable<Park[]>
   */
  getParkingById(keyword: string, idArea: number): Observable<Park[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword })
    };
    return this.http.get<Park[]>(this.apiURL + '/getParksByIdArea/' + idArea, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Prende tutti i dati del un parcheggio Park, con l'id passato, dalle API fornite da backend (GestioneParcheggioRestController)
   * token passato come parametro
   * idPArk passato come path param
   *
   * @param idPark
   * @returns Observable<Park>
   */
  getParkByIdPark(idPark: number): Observable<Park> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Park>(this.apiURL + '/getParkByIdPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Aggiunta di un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * park passato nel body
   * token passato come parametro
   *
   * @param park
   * @returns Observable<Park>
   */
  addParking(park: Park): Observable<Park> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Park>(this.apiURL + '/addPark', park, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica di un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * park passato nel body
   * token passato come parametro
   *
   * @param park
   * @returns Observable<Park>
   */
  editParking(park: Park): Observable<Park> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Park>(this.apiURL + '/editPark', park, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disattivazione di un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * idPark passato in path param
   * token passato come parametro
   *
   * @param idPark
   * @returns Observable<void>
   */
  disactivatePark(idPark: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/disactivatePark/' + idPark, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ri-attivazione di un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * idPark passato in path param
   * token passato come parametro
   *
   * @param idPark
   * @returns Observable<void>
   */
  activatePark(idPark: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activatePark/' + idPark, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Eliminazione di un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * idPark passato in path param
   * token passato come parametro
   *
   * @param idPark
   * @returns Observable<void>
   */
  deletePark(idPark: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deletePark/' + idPark, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Modifica aree associate a un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * idPark passato in path param
   * areas passato nel body
   * token passato come parametro
   *
   * @param idPark
   * @param areas
   * @returns  Observable<void>
   */
  editAssociateParkArea(idPark: number, areas: AreaAssociated[]): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/editAssociateAreaPark/' + idPark, areas, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni lista di varchi associati a un parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * idPark in path param
   * token come parametro
   *
   * @param idPark
   * @returns Observable<GateAssociated[]>
   */
  getAssociateGatePark(idPark: number): Observable<GateAssociated[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<GateAssociated[]>(this.apiURL + '/getAssociateGatePark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Ottieni le informazioni sul parcheggio richiamando le API fornite da backend (GestioneParcheggioRestController)
   * token in parametri
   *
   * @returns Observable<ParkStatus[]>
   */
  getParkStatus(): Observable<ParkStatus[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<ParkStatus[]>(this.apiURL + '/getParkStatus', options)
      .pipe(catchError(err => { throw err; }));
  }

  //Restituisce tutti i pacheggi associati all'utente
  getAssociatedParksToUser(): Observable<Park[]>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };

    return this.http.get<Park[]>(this.apiURL + "/getAllParksAssociated", options)
      .pipe(catchError(err => { throw err; }));
  }

}
