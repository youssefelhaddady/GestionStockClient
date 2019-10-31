import { CommandeFournisseurE } from './e_commande_fournisseur';
import { ModeReglementEnum } from './mode_reglement_enum';




export class ReglementFournisseurE{
    constructor(
        public idReglement?: number,
        public dateReglement?: Date,
        public mode?: ModeReglementEnum,
        public montant?: number,
        public commandeFournisseur?: CommandeFournisseurE
        ) { }
}

