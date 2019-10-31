import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { TokenStorageService } from 'app/auth/token.storage.service';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {

  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService) { }

  getClientsCount(): Observable<any> {
    return this.http.get(API_URLS.STATISTIQUES_URL + '/client/count');
  }

  getFournisseursCount(): Observable<any> {
    return this.http.get(API_URLS.STATISTIQUES_URL + '/fournisseur/count');
  }

  getOuvriersCount(): Observable<any> {
    return this.http.get(API_URLS.STATISTIQUES_URL + '/ouvrier/count');
  }

  getCommandesClientCount(): Observable<any> {
    return this.http.get(API_URLS.STATISTIQUES_URL + '/commande_client/count');
  }

  // getQtsForFirstCategory(): Observable<any> {
  //   const idMagasin = this.tokenStorageService.getMagasinId();

  //   return this.http.post(API_URLS.MOUVEMENT_STOCK_URL + '/first_category', idMagasin);
  // }
}
