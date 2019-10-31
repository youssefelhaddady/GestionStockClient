import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ChargeService } from '../services/charge.service';




@Injectable()
export class TypeChargeResolver implements Resolve<any> {


    constructor(private chargeService: ChargeService) {}

    resolve() {
        return this.chargeService.getAllChargeTypes();
    }
}
