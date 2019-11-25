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

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent extends DataTableHandler implements OnInit {

  currentDateTime = Date.now();
  categories: CategorieE[] = [];
  produits: ProduitE[] = [];

  produitForm: FormGroup;

  operation = 'add';
  produitSelectionne: ProduitE;

  qtes_produits_par_categorie: number[] = [];
  indice_categorie_selectionnee = 0;

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
    this.categories = this.route.snapshot.data.categories;
    this.produits = this.categories[this.indice_categorie_selectionnee].produits;
    this.loadQuatitiesForTheCurrentCategorie();
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
      data => { this.categories = data },
      error => { console.log('An error was occured on laoding categories.\nerror : ' + error) }
    )
  }

  addProduit() {
    const produitTemp = this.produitForm.value;
    produitTemp.categorie = this.categories[this.indice_categorie_selectionnee];

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

  loadQuatitiesForTheCurrentCategorie() {
    this.mouvementStockService.getQtByMagProd(this.categories[this.indice_categorie_selectionnee].idCategorie).subscribe(
      data => {
        this.qtes_produits_par_categorie = data;
      },
      error => {
        // console.log(error);
      }
    );
  }

  getQuantiteForEachProduct(i: number) {
    return this.qtes_produits_par_categorie[i];
  }

  selectCategorieChange(args) {
    this.indice_categorie_selectionnee = args.target.value;
    this.produits = this.categories[this.indice_categorie_selectionnee].produits;
    this.loadQuatitiesForTheCurrentCategorie();
  }
}
