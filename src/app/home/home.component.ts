import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'app/auth/token.storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  info: any;
 
  constructor(private token: TokenStorageService,
    private router: Router) { }
 
  ngOnInit() {
    // this.info = {
    //   token: this.token.getToken(),
    //   username: this.token.getUsername(),
    //   authorities: this.token.getAuthorities()
    // };
    if(this.token.getToken()){
      this.router.navigate(['/dashboard']);
    }
    else{
      this.router.navigate(['/login']);
    }
  }
 
  logout() {
    this.token.signOut();
    //window.location.reload();
    this.router.navigate(['/login']);
  }

}
