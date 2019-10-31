import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { CommandeClientAddingRequest } from 'app/exchange/e_commande_client';

@Injectable({
  providedIn: 'root'
})
export class CommandeClientService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(API_URLS.CMD_CLIENT_URL);
  }

  add(commandeClient: CommandeClientAddingRequest): Observable<any> {
    return this.http.post(API_URLS.CMD_CLIENT_URL + '/add_commande', commandeClient);
  }

  /*update(commandeClient: ClientE): Observable<any>{
      return this.http.put(API_URLS.CMD_CLIENT_URL, commandeClient);
  }

  delete(id_commandeClient: number): Observable<any>{
      return this.http.delete(API_URLS.CMD_CLIENT_URL + `/${id_commandeClient}`);
  }*/
}
