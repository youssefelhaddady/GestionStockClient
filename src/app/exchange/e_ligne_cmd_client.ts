import { ProduitE } from './e_produit';
import { CommandeClientE } from './e_commande_client';


export class LigneCmdClientE {
    constructor(
        public idLigneCmdClient?: number,
        public quantiteDemandee?: number,
        public quantiteServie?: number,
        public commandeClient?: CommandeClientE,
        public produit?: ProduitE
    ) { }
}