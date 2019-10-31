import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { CommandeFournisseurAddingRequest } from 'app/exchange/e_commande_fournisseur';

@Injectable({
  providedIn: 'root'
})
export class CommandeFournisseurService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.CMD_FOURNISSEUR_URL);
  }

  add(commandeFournisseur: CommandeFournisseurAddingRequest): Observable<any> {
    return this.http.post(API_URLS.CMD_FOURNISSEUR_URL + '/add_commande', commandeFournisseur);
  }

  /*update(commandeFournisseur: FournisseurE): Observable<any>{
      return this.http.put(API_URLS.CMD_FOURNISSEUR_URL, commandeFournisseur);
  }

  delete(id_commandeFournisseur: number): Observable<any>{
      return this.http.delete(API_URLS.CMD_FOURNISSEUR_URL + `/${id_commandeFournisseur}`);
  }*/
}
