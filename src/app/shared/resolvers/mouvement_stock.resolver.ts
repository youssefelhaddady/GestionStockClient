import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { MouvementStockService } from '../services/mouvement_stock.service';




@Injectable()
export class MouvementStockResolver implements Resolve<any> {


    constructor(private mouvementStockService: MouvementStockService) {}

    resolve() {
        return this.mouvementStockService.getQtsForFirstCategory();
    }
}
