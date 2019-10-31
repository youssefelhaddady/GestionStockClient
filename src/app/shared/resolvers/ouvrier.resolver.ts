import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { OuvrierService } from '../services/ouvrier.service';




@Injectable()
export class OuvrierResolver implements Resolve<any> {


    constructor(private ouvrierService: OuvrierService) {}

    resolve() {
        return this.ouvrierService.getAll();
    }
}
