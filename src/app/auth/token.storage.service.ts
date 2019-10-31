import { MagasinE } from './../exchange/e_magasin';
import { Injectable } from '@angular/core';
import {JwtHelperService , JWT_OPTIONS } from '@auth0/angular-jwt';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';
const MAGASIN_ID_KEY   = 'AuthMagasinId';
const MAGASIN_NAME_KEY   = 'AuthMagasinName';


/*
*   Manage Token & User Logout: (inside Browser’s sessionStorage)
*     +)  We use TokenStorageService to manage Token inside Browser’s sessionStorage
*     +)  For Logout action, we only need to clear Browser’s sessionStorage.
*/
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private roles: Array<string> = [];
  constructor() { }

  signOut() {
    window.sessionStorage.clear();
  }

  public saveToken(token) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public saveAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public  getAuthorities(): string[] {
    this.roles = [];

    if (sessionStorage.getItem(TOKEN_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority);
      });
    }

    return this.roles;
  }

  public saveMagasinId(magasin_id: number) {
    window.sessionStorage.removeItem(MAGASIN_ID_KEY);
    window.sessionStorage.setItem(MAGASIN_ID_KEY, magasin_id.toString());
  }

  public getMagasinId(): number {
    return Number(sessionStorage.getItem(MAGASIN_ID_KEY));
  }

  public saveMagasinName(magasin_name: string) {
    window.sessionStorage.removeItem(MAGASIN_NAME_KEY);
    window.sessionStorage.setItem(MAGASIN_NAME_KEY, magasin_name);
  }

  public getMagasinName(): string {
    return sessionStorage.getItem(MAGASIN_NAME_KEY);
  }

  parseJwt(jwt: any) {
    const jwtHelper = new JwtHelperService();
    const jwtObject = jwtHelper.decodeToken(jwt);
    this.saveMagasinId(jwtObject.magasinId);
    this.saveMagasinName(jwtObject.magasinName);
    this.saveAuthorities(jwtObject.roles);
    this.saveUsername(jwtObject.sub);
  }

}
