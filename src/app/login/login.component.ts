import { DataService } from './../shared/services/data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from 'app/exchange/model/login-info';
import { AuthService } from 'app/auth/auth.service';
import { TokenStorageService } from 'app/auth/token.storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  // isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  // roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private authService: AuthService,
     private tokenStorage: TokenStorageService,
     private router: Router,
     private data: DataService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      // this.isLoggedIn = true;
      // this.roles = this.tokenStorage.getAuthorities();
      this.router.navigate(['/dashboard']);
    }

  }

  onSubmit() {

    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);

    this.authService.attemptAuth(this.loginInfo).subscribe(
        (data: any) => {
          // console.log(data);
          const jwt = (data).headers.get('Authorization');
          this.tokenStorage.saveToken(jwt);
          this.tokenStorage.parseJwt(jwt);
          this.isLoginFailed = false;
          // this.isLoggedIn = true;
          // this.roles = this.tokenStorage.getAuthorities();
          this.notifySideBarMenu();
          this.router.navigate(['/dashboard']);
          // this.reloadPage();
      },
      error => {
        // console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  notifySideBarMenu() {
    this.data.onLoginSuccess();
  }

  reloadPage() {
    window.location.reload();
  }


}
