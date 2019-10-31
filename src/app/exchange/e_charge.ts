import { TypeChargeE } from './e_type_charge';
import { AppUserE } from './e_app_user';

export class ChargeE {
    constructor(
        public idCharge?: number,
        public dateCharge?: Date,
        public etat?: EtatDeCharge,
        public montant?: number,
        public typeDeCharge?: TypeChargeE,
        public user?: AppUserE
        ) { }
}

export enum EtatDeCharge {
    PAYE,
    NONPAYE
}
