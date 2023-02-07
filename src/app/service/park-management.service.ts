import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Area, Park } from '../domain/class';
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

  getParking(keyword: string, isActive: boolean): Observable<Park[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword, active: isActive })
    };
    return this.http.get<Park[]>(this.apiURL + '/getParks', options)
      .pipe(catchError(err => { throw err; }));
  }

  getAssociateAreaPark(idPark: number): Observable<Area[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.get<Area[]>(this.apiURL + '/getAssociateAreaPark/' + idPark, options)
      .pipe(catchError(err => { throw err; }));
  }


  getParkingById(keyword: string, idArea: number): Observable<Park[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService), keyword: keyword })
    };
    return this.http.get<Park[]>(this.apiURL + '/getParksByIdArea/' + idArea, options)
      .pipe(catchError(err => { throw err; }));
  }

  addParking(park: Park): Observable<Park> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Park>(this.apiURL + '/addPark', park, options)
      .pipe(catchError(err => { throw err; }));
  }

  editParking(park: Park): Observable<Park> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<Park>(this.apiURL + '/editPark', park, options)
      .pipe(catchError(err => { throw err; }));
  }

  deletePark(idPark: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/deletePark/' + idPark, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  activatePark(idPark: number): Observable<void> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService) })
    };
    return this.http.post<void>(this.apiURL + '/activatePark/' + idPark, null, options)
      .pipe(catchError(err => { throw err; }));
  }

}
