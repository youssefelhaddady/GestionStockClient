import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { ProduitE } from 'app/exchange/e_produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.PRODUIT_URL);
  }

  add(produit: ProduitE): Observable<any>{
    return this.http.post(API_URLS.PRODUIT_URL, produit);
  }

  update(produit: ProduitE): Observable<any>{
      return this.http.put(API_URLS.PRODUIT_URL, produit);
  }

  delete(id_produit: number): Observable<any>{
      return this.http.delete(API_URLS.PRODUIT_URL + `/${id_produit}`);
  }
}
