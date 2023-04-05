import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError } from 'rxjs';
import { Cookie } from '../shared/utils/cookieClass';
import { Logs } from '../domain/interface';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiURL = this.beUrl + 'logmanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string
  ){}

  /*
   * Restituisce la lista di tutti i logs che rispettano i filtri.
   * startDate e endDate sono parametri obbligatori
   * name, componentName e operation sono opzionali
  * */
  getListLogs(startDate: string, endDate:string, name?:string, componentName?:string, operation?:string): Observable<Logs[]>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService),
        startDate, endDate, name, componentName, operation
      })
    };

    return this.http.get<Logs[]>(this.apiURL +'/getLogList', options)
      .pipe(catchError( err => {throw err;}));
  }

  /*
   * Restituisce la lista dei nomi dei componenti, appartenenti alla tabella componenti nel DB
   * nessun parametro è richiesto eccetto il token
  * */
  getComponentsName(): Observable<string[]>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService)})
    };

    return this.http.get<string[]>(this.apiURL + '/getComponentsName', options)
      .pipe(catchError( err => {throw err;}));
  }

  /*
   * Restituisce la lista delle operazioni appartenenti alla tabella sottofunzione nel DB
  * */
  getOperationsName(): Observable<string[]>{
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService)})
    };

    return this.http.get<string[]>(this.apiURL + '/getOperationsName', options)
      .pipe(catchError( err => {throw err;}));
  }
}
