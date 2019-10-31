import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { FournisseurE } from 'app/exchange/e_fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.FOURNISSEUR_URL);
  }

  add(fournisseur: FournisseurE): Observable<any>{
    return this.http.post(API_URLS.FOURNISSEUR_URL, fournisseur);
  }

  update(fournisseur: FournisseurE): Observable<any>{
      return this.http.put(API_URLS.FOURNISSEUR_URL, fournisseur);
  }

  delete(id_fournisseur: number): Observable<any>{
      return this.http.delete(API_URLS.FOURNISSEUR_URL + `/${id_fournisseur}`);
  }
}
