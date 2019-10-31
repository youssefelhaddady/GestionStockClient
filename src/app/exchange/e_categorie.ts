import { ProduitE } from './e_produit';


export class CategorieE {
    constructor(
        public idCategorie ?: number,
        public label ?: string,
        public description ?: string,
        public produits ?: ProduitE[],
        public quantites ?: number[]
        ) { }
}
