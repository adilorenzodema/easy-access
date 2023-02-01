import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of } from 'rxjs';
import { Area } from '../domain/class';
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

  getAreaList(keyword: string, isActive: boolean): Observable<Area[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword, active: isActive })
    };
    return this.http.get<Area[]>(this.apiURL + '/getAreas', options)
      .pipe(catchError(err => { throw err; }));
  }

  getAreasByIdPark(idPark: number): Observable<Area[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Area[]>(this.apiURL + '/getAreasByIdPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }

  addArea(area: Area): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Area>(this.apiURL + '/addArea', area, options)
      .pipe(catchError(err => { throw err; }));
  }

  editArea(area: Area): Observable<Area> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Area>(this.apiURL + '/editArea', area, options)
      .pipe(catchError(err => { throw err; }));
  }

  deleteArea(idArea: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deleteArea/' + idArea, null, options)
      .pipe(catchError(err => { throw err; }));
  }
}
