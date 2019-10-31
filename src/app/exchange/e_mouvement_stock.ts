import { MagasinE } from './e_magasin';
import { ProduitE } from './e_produit';



export class MouvementStockE {

    constructor(
        public idMvmtStk?: number,
        public dateMvmt?: Date,
        public quantite?: number,
        public type?: number,
        public produit?: ProduitE,
        public magasin?: MagasinE
    ) { }
}
