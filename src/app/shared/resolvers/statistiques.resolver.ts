import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { StatistiquesService } from '../services/statistiques.service';


@Injectable()
export class StatClientCountResolver implements Resolve<any> {
    constructor(private statistiquesService: StatistiquesService) {}
    resolve() {
        return this.statistiquesService.getClientsCount();
    }
}

@Injectable()
export class StatFournisseurCountResolver implements Resolve<any> {
    constructor(private statistiquesService: StatistiquesService) {}
    resolve() {
        return this.statistiquesService.getFournisseursCount();
    }
}

@Injectable()
export class StatOuvrierCountResolver implements Resolve<any> {
    constructor(private statistiquesService: StatistiquesService) {}

    resolve() {
        return this.statistiquesService.getOuvriersCount();
    }
}

@Injectable()
export class StatCommandesClientCountResolver implements Resolve<any> {


    constructor(private statistiquesService: StatistiquesService) {}

    resolve() {
        return this.statistiquesService.getCommandesClientCount();
    }
}
