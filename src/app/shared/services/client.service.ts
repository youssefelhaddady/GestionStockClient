import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { ClientE } from 'app/exchange/e_client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.CLIENT_URL);
  }

  add(client: ClientE): Observable<any>{
    return this.http.post(API_URLS.CLIENT_URL, client);
  }

  update(client: ClientE): Observable<any>{
      return this.http.put(API_URLS.CLIENT_URL, client);
  }

  delete(id_client: number): Observable<any>{
      return this.http.delete(API_URLS.CLIENT_URL + `/${id_client}`);
  }
}
