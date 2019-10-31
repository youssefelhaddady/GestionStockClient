import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { HttpClient } from '@angular/common/http';


/*
*    access to protected resources simply
*/
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // getUserBoard(): Observable<string> {
  //   return this.http.get(API_URLS.USER_URL, { responseType: 'text' });
  // }

  // getPMBoard(): Observable<string> {
  //   return this.http.get(API_URLS.PM_URL, { responseType: 'text' });
  // }

  getAdminBoard(): Observable<string> {
    return this.http.get(API_URLS.ADMIN_URL, { responseType: 'text' });
  }
}
