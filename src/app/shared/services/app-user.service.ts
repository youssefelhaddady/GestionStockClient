import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from 'app/config/api.url.config';
import { AppUserE } from 'app/exchange/e_app_user';
import { SignUpInfo } from 'app/exchange/model/signup-info';



@Injectable()
export class AppUserService {

    constructor(private http: HttpClient) { }

    getAll(): Observable<any> {
        return this.http.get(API_URLS.APP_USERS_URL);
    }

    add(appUser: AppUserE): Observable<any> {
        return this.http.post(API_URLS.SIGNUP_URL, appUser);
    }

    update(appUser: AppUserE): Observable<any> {
        return this.http.put(API_URLS.APP_USERS_URL, appUser);
    }

    delete(id_app_user: number): Observable<any> {
        return this.http.delete(API_URLS.APP_USERS_URL + `/${id_app_user}`);
    }
}
