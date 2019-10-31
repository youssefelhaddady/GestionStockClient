import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URLS } from '../config/api.url.config';
import { AuthLoginInfo } from 'app/exchange/model/login-info';
import { JwtResponse } from 'app/exchange/model/jwt-response';
import { SignUpInfo } from 'app/exchange/model/signup-info';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response'

};

/*
*   send HTTP Requests (signin/signup) using Angular HttpClient
*/
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }
 
  attemptAuth(credentials: AuthLoginInfo) {
    return this.http.post<JwtResponse>(API_URLS.LOGIN_URL, credentials, {'observe' : 'response'});
  }
 
  signUp(info: SignUpInfo): Observable<any> {
    return this.http.post<string>(API_URLS.SIGNUP_URL, info, {  'observe': 'response' , 'responseType': 'json'});
  }


}
