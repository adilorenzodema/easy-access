import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Job } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class BatchManagementService {
  private apiURL = this.beUrl + 'batchmanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string
  ) { }

  /**
   * Prende tutti i Job richiamando le API fornite da bacneknd (GestioneBatchRestController)
   * token come parametro
   *
   * @returns Observable<Job[]>
   */
  getAllJobs(): Observable<Job[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Job[]>(this.apiURL + '/getAllJobs', options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Disabilita Job richiamando le API fornite da bacneknd (GestioneBatchRestController)
   * jobName passato come path param
   *
   * @param jobName
   * @returns Observable<void>
   */
  disableJob(jobName: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/unschedule/' + jobName, null,  options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Schedula Job richiamando le API fornite da bacneknd (GestioneBatchRestController)
   * jobName passato come path param
   * token passato come parametro
   *
   * @param jobName
   * @returns Observable<void>
   */
  enableJob(jobName: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/schedule/' + jobName, null,  options)
      .pipe(catchError(err => { throw err; }));
  }

  /**
   * Esegui Job richiamando le API fornite da bacneknd (GestioneBatchRestController)
   * token passato come parametro
   * jobName passato come path param
   *
   * @param jobName
   * @returns
   */
  runJob(jobName: string): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/run/' + jobName, null,  options)
      .pipe(catchError(err => { throw err; }));
  }
}
