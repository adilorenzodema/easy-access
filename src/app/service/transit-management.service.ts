import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpUtils } from 'dema-movyon-template';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable } from 'rxjs';
import { Transit } from '../domain/interface';
import { Cookie } from '../shared/utils/cookieClass';

@Injectable({
  providedIn: 'root'
})
export class TransitService {
  private apiURL = this.beUrl + 'transitmanagement';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject('beUrl') private beUrl: string) { }

    /**
     * Prende una lista di transiti Transit
     * I valori sono passati come parametri
     * @param startDate
     * @param endDate
     * @param obuCodeKeyword
     * @param gateNameKeyword
     * @param parkNameKeyword
     * @param validationType
     * @param flagTransited
     * @returns Observable<Transit[]>
     */
  getTransitList(startDate: string, endDate: string, obuCodeKeyword: string, gateNameKeyword: string, parkNameKeyword: string, validationType: string,
    flagTransited: boolean, plate: string): Observable<Transit[]> {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: HttpUtils.createHttpParams({ token: Cookie.getToken(this.cookieService),
        startDate, endDate, obuCodeKeyword, gateNameKeyword, parkNameKeyword, validationType, flagTransited, plate })
    };
    return this.http.get<Transit[]>(this.apiURL + '/getAllTransits', options)
      .pipe(catchError(err => { throw err; }));
  }
}
