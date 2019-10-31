import { MagasinE } from 'app/exchange/e_magasin';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';

@Injectable({
  providedIn: 'root'
})
export class MagasinService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.MAGASIN_URL);
  }

  getByUsername(username: string): Observable<any> {
    return this.http.post(API_URLS.MAGASIN_URL + '/by_username', username);
  }

  update(magasin: MagasinE): Observable<any> {
    return this.http.put(API_URLS.MAGASIN_URL, magasin);
}
}
