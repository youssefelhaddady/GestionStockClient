import { AppUserE } from './e_app_user';

export class CaisseE {
    constructor(
        public idCaisse?: number,
        public somme?: number,
        public user?: AppUserE
        ) { }
}

