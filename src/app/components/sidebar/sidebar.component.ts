import { DataService } from './../../shared/services/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'app/auth/token.storage.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  visible: boolean;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/login', title: '  تسجيل الدخول ', visible: false, icon: '', class: '' },
  { path: '/dashboard', title: '  الرئيسية ', visible: false, icon: '', class: '' },
  { path: '/commande', title: 'طلبات الزبناء', visible: false, icon: '', class: '' },
  { path: '/addprod', title: 'إضافة منتوج', visible: false, icon: '', class: '' },
  { path: '/stock', title: 'المخزون', visible: false, icon: '', class: '' },
  { path: '/client', title: 'الزبناء', visible: false, icon: '', class: '' },
  { path: '/fournisseur', title: 'المزودون', visible: false, icon: '', class: '' },
  { path: '/charge', title: 'التكاليف', visible: false, icon: '', class: '' },
  { path: '/employe', title: 'العمال', visible: false, icon: '', class: '' },
  // { path: '/app_users', title: '  المستخدمين ', visible: false, icon: '', class: '' },
  { path: '/statistique', title: 'الإحصائيات', visible: false, icon: '', class: '' },
  // { path: '/notifications', title: 'Notifications',  icon:'', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  private roles: string[];

  constructor(private tokenStorage: TokenStorageService, private router: Router, private data: DataService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    if (this.tokenStorage.getToken()) {
      this.showMenuForTheUser();
    } else {
      ROUTES[0].visible = true;
      this.router.navigate(['/login']);
    }

    if (this.data.subVar === undefined) {
      this.data.subVar = this.data.refreshSideBarMenuItems.subscribe(() => {
        this.showMenuForTheUser();
      });
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  showMenuForTheUser() {
    this.roles = this.tokenStorage.getAuthorities();

    if (this.roles.length !== 0) {
      /*this.roles.every(role => {
        // if (role === 'ROLE_ADMIN') {
        if (role === 'ADMIN') {
          this.makeAllMenuItemsVisible(true);
          ROUTES[0].visible = false;
          return false;
        } else if (role === 'ROLE_PM') {
          return false;
        }
        this.makeUsersMenuItems();
        return true;
      });*/
      if(this.roles.includes('ADMIN')) {
        this.makeAllMenuItemsVisible(true);
        ROUTES[0].visible = false;
      } else if(this.roles.includes('USER')) {
        this.makeUsersMenuItems();
      }
    } else {
      this.makeAllMenuItemsVisible(false);
      ROUTES[0].visible = true;
    }
  }

  makeAllMenuItemsVisible(visible: boolean) {
    ROUTES.forEach(menuItem => {
      menuItem.visible = visible;
    })
  }

  makeUsersMenuItems() {
    ROUTES[0].visible = false; ROUTES[1].visible = true; ROUTES[2].visible = true;
    ROUTES[3].visible = true; ROUTES[4].visible = true; ROUTES[5].visible = true;
    ROUTES[6].visible = true; ROUTES[7].visible = false;
    ROUTES[8].visible = false; ROUTES[9].visible = false; ROUTES[10].visible = false;
  }
}
