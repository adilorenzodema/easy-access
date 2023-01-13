import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../components/domain/class';
import { UserProfile } from '../components/domain/interface';
import { HttpUtils } from '../shared/utils/httpUtils';
//import { userMokup } from './mokup/mokup';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private apiURL = 'http://localhost:8080/api/manageUsers';
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getUserList(keyword: string, isActive: boolean): Observable<User[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken(), keyword: keyword, active: isActive })
    };
    return this.http.get<User[]>(this.apiURL + '/getUsers', options)
      .pipe(catchError(err => { throw err; }));
  }

  addUser(user: User): Observable<User> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<User>(this.apiURL + '/addUser', user, options)
      .pipe(catchError(err => { throw err; }));
  }

  editUser(user: User): Observable<User> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post<User>(this.apiURL + '/editUser', user, options)
      .pipe(catchError(err => { throw err; }));
  }

  getProfileList(): Observable<UserProfile[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.get<UserProfile[]>(this.apiURL + '/getAllProfiles', options)
      .pipe(catchError(err => { throw err; }));
  }

  deleteUser(userId: number): Observable<unknown> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post(this.apiURL + '/deleteUser/' + userId, null, options)
      .pipe(catchError(err => { throw err; }));
  }

  activateUser(userId: number): Observable<unknown> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: this.getToken() })
    };
    return this.http.post(this.apiURL + '/activeUser/' + userId, null, options)
      .pipe(catchError(err => { throw err; }));
  }


  private getToken(): string {
    return JSON.parse(this.cookieService.get('Token'));
  }
}
