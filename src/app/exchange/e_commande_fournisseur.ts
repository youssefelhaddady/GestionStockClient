import { ProduitE } from './e_produit';
import { FournisseurE } from './e_fournisseur';
import { LigneCmdFournisseurE } from './e_ligne_cmd_fournisseur';
import { ReglementFournisseurE } from './e_reglement_fournisseur';




export class CommandeFournisseurE {
    constructor(
        public idCmdFournisseur?: number,
        public codeCmdF?: string,
        public dateCmdF?: Date,
        public montantTotal?: number,
        public fournisseur?: FournisseurE,
        public reglements?: ReglementFournisseurE[]
        ) { }
}

export class CommandeTable {
    constructor(
        public produit?: ProduitE,
        public quantite?: number,
        public somme?: number
    ) { }
}

export class CommandeFournisseurAddingRequest extends CommandeFournisseurE {
    constructor(
        public idMagasin?: number,
        public lignesCmdFournisseur?: LigneCmdFournisseurE[]
    ) {
        super();
    }
}
