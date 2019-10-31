import { CategorieE } from './e_categorie';



export class ProduitE {
    constructor(
        public idProduit ?: number,
        public codeProduit?: string,
        public libelle?: string,
        public description?: string,
        public image?: string,
        public prixDachat ?: number,
        public prixUnitaire?: number,
        public categorie?: CategorieE
        //public poids?: number,
        //public quantite?: number,
        ) { }
}
