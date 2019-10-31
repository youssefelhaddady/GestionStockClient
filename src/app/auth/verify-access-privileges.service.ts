import { Router } from '@angular/router';
import { TokenStorageService } from './token.storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerifyAccessPrivilegesService {
  private roles: string[];

  constructor(private tokenStorage: TokenStorageService,
    private router: Router) { }

  verify() {
    this.roles = this.tokenStorage.getAuthorities();

    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.roles.length !== 0) {
      this.roles.every(role => {
        if (role === 'ADMIN') {
          return false;
        } else if (role === 'ROLE_PM') {
          return false;
        }
        this.router.navigate(['/access_denied']);
        return true;
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
