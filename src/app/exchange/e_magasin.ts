import { AppUserE } from 'app/exchange/e_app_user';
export class MagasinE {

    constructor(
        public idMagasin?: number,
        public nom?: string,
        public adresse?: string,
        public numero_patente?: number,
        public superficie?: string,
        public user?: AppUserE
    ) { }
}
