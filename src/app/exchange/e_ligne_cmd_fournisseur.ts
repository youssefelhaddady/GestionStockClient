import { ProduitE } from './e_produit';
import { CommandeFournisseurE } from './e_commande_fournisseur';


export class LigneCmdFournisseurE {
    constructor(
        public idLigneCmdFournisseur?: number,
        public quantite?: number,
        public commandeFournisseur?: CommandeFournisseurE,
        public produit?: ProduitE
    ) { }
}