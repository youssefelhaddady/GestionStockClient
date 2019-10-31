import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { CategorieService } from '../services/categorie.service';




@Injectable()
export class CategorieRosolver implements Resolve<any> {
    constructor(private categorieService: CategorieService) {}

    resolve() {
        return this.categorieService.getAll();
    }
}

@Injectable()
export class CategorieRosolverForClientCommandes implements Resolve<any> {
    constructor(private categorieService: CategorieService) {}

    resolve() {
        return this.categorieService.getAllByMagasin();
    }
}
