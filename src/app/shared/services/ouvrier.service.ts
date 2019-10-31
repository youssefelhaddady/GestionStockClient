import { OuvrierE, AbsenceE } from './../../exchange/e_ouvrier';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';

@Injectable({
  providedIn: 'root'
})
export class OuvrierService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.OUVRIER_URL);
  }

  add(ouvrier: OuvrierE): Observable<any> {
    return this.http.post(API_URLS.OUVRIER_URL, ouvrier);
  }

  update(ouvrier: OuvrierE): Observable<any> {
    return this.http.put(API_URLS.OUVRIER_URL, ouvrier);
  }

  delete(id_ouvrier: number): Observable<any> {
    return this.http.delete(API_URLS.OUVRIER_URL + `/${id_ouvrier}`);
  }

  signAbsence(absence: AbsenceE): Observable<any> {
    return this.http.post(API_URLS.OUVRIER_URL + '/ouvrier_absence/sign', absence);
  }

  giveAmount(ouvrier: OuvrierE): Observable<any> {
    return this.http.post(API_URLS.OUVRIER_URL + '/ouvrier_absence/give_amount', ouvrier);
  }
}
