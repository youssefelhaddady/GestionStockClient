import { TokenStorageService } from 'app/auth/token.storage.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { MagasinService } from '../services/magasin.service';




@Injectable()
export class MagasinResolver implements Resolve<any> {


    constructor(private magasinService: MagasinService, private tokenStorage: TokenStorageService) {}

    resolve() {
        return this.magasinService.getByUsername(this.tokenStorage.getUsername());
    }
}
