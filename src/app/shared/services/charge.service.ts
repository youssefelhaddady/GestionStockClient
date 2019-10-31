import { TypeChargeE } from './../../exchange/e_type_charge';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { ChargeE } from 'app/exchange/e_charge';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.CHARGE_URL);
  }

  add(charge: ChargeE): Observable<any>{
    return this.http.post(API_URLS.CHARGE_URL, charge);
  }

  update(charge: ChargeE): Observable<any>{
      return this.http.put(API_URLS.CHARGE_URL, charge);
  }

  delete(id_charge: number): Observable<any>{
      return this.http.delete(API_URLS.CHARGE_URL + `/${id_charge}`);
  }

  getAllChargeTypes(): Observable<any> {
    return this.http.get(API_URLS.TYPE_CHARGE_URL);
  }

  addChargeType(type: TypeChargeE): Observable<any> {
    return this.http.post(API_URLS.TYPE_CHARGE_URL, type);
  }
}
