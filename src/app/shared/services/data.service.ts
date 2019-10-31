import { Subscription } from 'rxjs/Subscription';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  refreshSideBarMenuItems = new EventEmitter();
  subVar: Subscription;

  constructor() { }

  onLoginSuccess() {
    this.refreshSideBarMenuItems.emit();
  }
}
