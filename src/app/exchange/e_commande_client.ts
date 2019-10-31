import { LigneCmdClientE } from './e_ligne_cmd_client';
import { FactureE } from './e_facture';
import { ClientE } from './e_client';
import { ReglementClientE } from './e_reglement_client';




export class CommandeClientE {
    constructor(
        public idCommandeClient?: number,
        public codeCmd?: string,
        public dateCmd?: Date,
        public montantPaye?: number,
        public montantTotal?: number,
        public livraison?: boolean,
        public client?: ClientE,
        public facture?: FactureE,
        public reglements?: ReglementClientE[]
    ) { }
}

export class CommandeTable {
    constructor(
        public categorieName?: string,
        public productName?: string,
        public productId?: number,
        public prix?: number,
        public quantite?: number,
        public somme?: number
    ) { }
}

export class CommandeClientAddingRequest extends CommandeClientE {
    constructor(
        public idMagasin?: number,
        public lignesCmdClient?: LigneCmdClientE[]
    ) {
        super();
    }
}
