import { MagasinE } from 'app/exchange/e_magasin';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { CategorieE } from 'app/exchange/e_categorie';
import { TokenStorageService } from 'app/auth/token.storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient,
    private tokenStorageService: TokenStorageService) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.CATEGORIE_URL);
  }

  getAllByMagasin(): Observable<any> {
    const idMagasin = this.tokenStorageService.getMagasinId();
    const magasin = new MagasinE(idMagasin);
    return this.http.post(API_URLS.CATEGORIE_URL + '/by_mag', magasin)
  }

  add(categorie: CategorieE): Observable<any> {
    return this.http.post(API_URLS.CATEGORIE_URL, categorie);
  }

  update(categorie: CategorieE): Observable<any> {
    return this.http.put(API_URLS.CATEGORIE_URL, categorie);
  }

  delete(id_categorie: number): Observable<any> {
    return this.http.delete(API_URLS.CATEGORIE_URL + `/${id_categorie}`);
  }
}
