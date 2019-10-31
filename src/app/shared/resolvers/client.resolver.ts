import { TokenStorageService } from 'app/auth/token.storage.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ClientService } from '../services/client.service';




@Injectable()
export class ClientResolver implements Resolve<any> {


    constructor(private clientService: ClientService) {}

    resolve() {
        return this.clientService.getAll();
    }
}
