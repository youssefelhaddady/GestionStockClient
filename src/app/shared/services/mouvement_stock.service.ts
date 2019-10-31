import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { TokenStorageService } from 'app/auth/token.storage.service';

@Injectable({
  providedIn: 'root'
})
export class MouvementStockService {

  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.MOUVEMENT_STOCK_URL);
  }

  getQtsForFirstCategory(): Observable<any> {
    const idMagasin = this.tokenStorageService.getMagasinId();

    return this.http.post(API_URLS.MOUVEMENT_STOCK_URL + '/first_category', idMagasin);
  }

  getQtByMagProd(idCategorie: number): Observable<any> {
    const idMagasin = this.tokenStorageService.getMagasinId();

    return this.http.post(API_URLS.MOUVEMENT_STOCK_URL + '/by_mag_prod', {idMagasin, idCategorie});
  }
}
