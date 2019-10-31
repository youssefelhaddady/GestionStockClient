import { TokenStorageService } from './../../auth/token.storage.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/shared/services/data.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {

  constructor(private router: Router, private tokenStorage: TokenStorageService, private dataService: DataService) { }

  ngOnInit() {
  }

  mainPage() {
    this.router.navigate(['/dashboard'])
  }

  loginPage() {
    this.tokenStorage.signOut();
    this.notifySideBarMenu();
    this.router.navigate(['/login']);
  }

  notifySideBarMenu() {
    this.dataService.onLoginSuccess();
  }

}
