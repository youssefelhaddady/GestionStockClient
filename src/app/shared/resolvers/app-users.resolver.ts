import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppUserService } from '../services/app-user.service';


@Injectable()
export class AppUserResolver implements Resolve<any> {

    constructor(private appUserService: AppUserService) {

    }

    resolve() {
        return this.appUserService.getAll();
    }
}
