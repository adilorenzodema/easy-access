import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of } from 'rxjs';
import { Area } from '../components/domain/class';

@Injectable({
  providedIn: 'root'
})
export class AreaManagementService {
  private apiURL = this.beUrl + 'gestionearea';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

  getAreaList(keyword: string): Observable<Area[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken(), keyword: keyword })
    };
    return this.http.get<Area[]>(this.apiURL + '/getAree', options)
      .pipe(catchError(err => { throw err; }));
  }

  addArea(area: Area): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<Area>(this.apiURL + '/addArea', area, options)
      .pipe(catchError(err => { throw err; }));
  }

  editArea(area: Area): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<Area>(this.apiURL + '/editArea', area, options)
      .pipe(catchError(err => { throw err; }));
  }

  deleteArea(idArea: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<void>(this.apiURL + '/deleteArea/' + idArea, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  private getToken(): string {
    return this.cookieService.get('Token');
  }
}
