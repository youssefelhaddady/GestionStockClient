import { ProduitService } from './../shared/services/produit.service';
import { CategorieService } from './../shared/services/categorie.service';
import { Component, OnInit } from '@angular/core';
import { ProduitE } from '../exchange/e_produit';
import { CategorieE } from '../exchange/e_categorie';
import { ActivatedRoute } from '@angular/router';
import { MouvementStockService } from 'app/shared/services/mouvement_stock.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeedBackService, COMPONENT_NAME } from 'app/config/feed-back.service';
import { DataTableHandler } from 'app/config/dataTableHandler';
import { DELETE_DECISION } from 'app/config/delete_decision.enum';
import { DetailProduit } from 'app/exchange/e_detail_produit';
import { MagasinE } from 'app/exchange/e_magasin';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent extends DataTableHandler implements OnInit {

  currentDateTime = Date.now();
  currentMagasin = new MagasinE(); // le magasin lié à l'USER de l'app

  /* magasin */
  magasins: MagasinE[] = [];  // tableau des magasins
  indiceMagasinSelectionne = 0; // selectionnement de magasin

  /* categorie */
  categories: CategorieE[] = [];
  indiceCategorieSelectionne = 0;

  /* produits */
  produits: ProduitE[] = [];
  produitSelectionne: ProduitE;

  produitForm: FormGroup;

  operation = 'add';


  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private mouvementStockService: MouvementStockService,
    private feedBackService: FeedBackService) {
    super();
  }

  ngOnInit() {
    this.initProduit();
    this.initDataTable();

    // loading data using resolvers
    this.initMagasins();

    this.categories = this.route.snapshot.data.categories;
    if (this.categories[this.indiceCategorieSelectionne]) {
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;
    }
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.MAGASIN);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initProduit() {
    this.produitSelectionne = new ProduitE();
    this.createForms();
  }

  initMagasins() {
    this.magasins = this.route.snapshot.data.magasins;
  }

  createForms() {
    this.produitForm = this.formBuilder.group({
      libelle: '',
      prixDachat: '',
      prixUnitaire: '',
      quantite: ''
    });
  }

  loadCategories() {
    this.categorieService.getAll().subscribe(
      data => {
        this.categories = data;
        if (this.categories[this.indiceCategorieSelectionne]) {
          this.produits = this.categories[this.indiceCategorieSelectionne].produits;
        }
      },
      error => { console.log('An error was occured on laoding categories.\nerror : ' + error) }
    )
  }

  addProduit() {
    const produitTemp = this.produitForm.value;
    produitTemp.categorie = this.categories[this.indiceCategorieSelectionne];

    // console.log(produitTemp);
    this.produitService.add(produitTemp).subscribe(
      res => {
        this.initProduit();
        this.loadCategories();
      }
    );
  }

  updateProduit() {
    const produitTemp = this.produitForm.value;
    produitTemp.idProduit = this.produitSelectionne.idProduit;

    this.produitService.update(produitTemp).subscribe(
      res => {
        this.initProduit();
        this.loadCategories();
      }
    );
  }

  deleteProduit() {
    // console.log(this.produitSelectionne)
    this.produitService.deleteControlled(this.produitSelectionne.idProduit, DELETE_DECISION.DELETE).subscribe(
      res => {
        this.initProduit();
        this.loadCategories();
      });
  }

  operationError() {
    console.log('operation not founded !');
  }

  selectCategorieChange(args) {
    this.indiceCategorieSelectionne = args.target.value;
    if (this.categories[this.indiceCategorieSelectionne]) {
      // remplir le tebleau des produits
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;
    }
  }

  magasinSelectChange(args) {
    this.indiceMagasinSelectionne = args.target.value;  // indice de la categorie sélectionnée
  }

  getProductDetail(produit: ProduitE): DetailProduit {
    const mag = this.magasins[this.indiceMagasinSelectionne];
    if (mag === undefined || mag === null) {
      return null;
    }

    const d = produit.details.find(
      detail => detail.idMagasin === mag.idMagasin
    );
    return d !== undefined ? d : null;
  }

  getQuantite(produit: ProduitE): number {
    // return this.qtes_produits_par_categorie[i];
    if (this.getProductDetail(produit)) {
      return this.getProductDetail(produit).quantite;
    }
    return -1;
  }

  getPrixAchat(produit: ProduitE): number {
    if (this.getProductDetail(produit)) {
      return this.getProductDetail(produit).prixAchat;
    }
    return -1;
  }

  getPrixVente(produit: ProduitE): number {
    if (this.getProductDetail(produit)) {
      return this.getProductDetail(produit).prixVente;
    }
    return -1;
  }

}
