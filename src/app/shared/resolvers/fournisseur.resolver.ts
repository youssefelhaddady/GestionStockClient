import { FournisseurService } from './../services/fournisseur.service';
import { TokenStorageService } from 'app/auth/token.storage.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';




@Injectable()
export class FournisseurResolver implements Resolve<any> {


    constructor(private fournisseurService: FournisseurService) {}

    resolve() {
        return this.fournisseurService.getAll();
    }
}
