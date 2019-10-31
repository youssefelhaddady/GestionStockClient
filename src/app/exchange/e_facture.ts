import { CommandeClientE } from './e_commande_client';



export class FactureE{
    constructor(
        public idFacture?: number,
        public dateFacture?: Date,
        public totalFinal?: number,
        public commandeClient?: CommandeClientE
        ) { }
}
