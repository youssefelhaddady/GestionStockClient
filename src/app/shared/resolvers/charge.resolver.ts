import { TokenStorageService } from 'app/auth/token.storage.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ChargeService } from '../services/charge.service';




@Injectable()
export class ChargeResolver implements Resolve<any> {


    constructor(private chargeService: ChargeService) {}

    resolve() {
        return this.chargeService.getAll();
    }
}
