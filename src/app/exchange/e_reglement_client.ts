import { CommandeClientE } from './e_commande_client';
import { ModeReglementEnum } from './mode_reglement_enum';




export class ReglementClientE{
    constructor(
        public idReglement?: number,
        public dateReglement?: Date,
        public mode?: ModeReglementEnum,
        public montant?: number,
        public commandeClient?: CommandeClientE
        ) { }
}

