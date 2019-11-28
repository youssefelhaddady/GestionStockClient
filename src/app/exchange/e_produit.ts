import { CategorieE } from './e_categorie';
import { DetailProduit } from './e_detail_produit';



export class ProduitE {
    constructor(
        public idProduit ?: number,
        public codeProduit?: string,
        public libelle?: string,
        public description?: string,
        public image?: string,
        public dateExp?: Date,
        public datePro?: Date,
        public categorie?: CategorieE,
        public details?: DetailProduit[]
        //public poids?: number,
        //public quantite?: number,
        ) { }
}
