import { FeedBackService, OPERATION_TYPE } from './../config/feed-back.service';
import { ActivatedRoute } from '@angular/router';
import { CategorieE } from 'app/exchange/e_categorie';
import { CommandeFournisseurService } from 'app/shared/services/commande_fournisseur.service';
import { CommandeTable, CommandeFournisseurAddingRequest } from 'app/exchange/e_commande_fournisseur';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { FournisseurService } from 'app/shared/services/fournisseur.service';
import { FournisseurE } from 'app/exchange/e_fournisseur';
import { LigneCmdFournisseurE } from 'app/exchange/e_ligne_cmd_fournisseur';
import { MagasinE } from 'app/exchange/e_magasin';
import { ModeReglementEnum } from 'app/exchange/mode_reglement_enum';
import { ProduitE } from '../exchange/e_produit';
import { ReglementClientE } from 'app/exchange/e_reglement_client';
import { TokenStorageService } from 'app/auth/token.storage.service';
import { COMPONENT_NAME } from 'app/config/feed-back.service';
import { DetailProduit } from 'app/exchange/e_detail_produit';

@Component({
  selector: 'app-addprod',
  templateUrl: './addprod.component.html',
  styleUrls: ['./addprod.component.scss']
})
export class AddprodComponent implements OnInit {
  visibleComponent = false;
  currentDateTime = Date.now(); // La date d'aujourd'hui
  currentMagasin = new MagasinE(); // le magasin lié à l'USER de l'app

  /* magasin */
  magasins: MagasinE[] = [];  // tableau des magasins
  indiceMagasinSelectionne = 0; // selectionnement de magasin

  /* Fournisseur */
  fournisseurs: FournisseurE[] = [];  // tableau des fournisseurs
  indiceFournisseurSelectionne = 0; // selectionnement de fournisseur

  /* categorie */
  categories: CategorieE[] = []; // tableau des categories de la liste déroulante (pour faciliter le choix des produits)
  indiceCategorieSelectionne = 0; // selectionnement de la catégorie des produits

  /* produits */
  // tableau des produits de la liste déroulante qui va se varirer pour l'affichage des produits selon la catégorie sélectionnée
  produits: ProduitE[] = [];
  indiceProduitSelectionne = 0;  // slectionnement du produit

  /* commnade */
  commandeTable: CommandeTable[] = []; // le tableau général des produits choisis pour la commande courantes (prod, prix, quantité et somme)

  prixAchatLigneCommande = 0; // prix d'achat du produit sélectionné - attribut du formularire de selectionnement de produit
  prixVenteLigneCommande = 0; // prix de vente du produit sélectionné - attribut du formularire de selectionnement de produit
  quantiteLigneCommande = 0; // quantité du produit sélectionné - attribut du formularire de selectionnement de produit
  /*
  qts_prods_cat: number[] = [];   // liste contenant les quantites des produits de la categorie sélectionnée
  */

  /* paiement */
  reglementTable: ReglementClientE[] = []; // le tableau général des méthodes de paiement/montant de la commande courrante
  // mode du paiement (cheque,espece .. ) - attribut du formulaire de paiement
  modeLigneReglement: ModeReglementEnum = ModeReglementEnum.ESPECES;
  montantLigneReglement = 0; // montant qui a été payé pour cette méthode - attribut du formulaire de paiement

  montantTotalCmd = 0; // monatant total de la commande actuelle
  // montant total des différentes méthodes de paiement
  // (sert pour la validation de la commande et pour l'affichage du mantant réstant à payer dans le formulaire)
  montantTotalReglements = 0;

  isNewCategorie = false;

  addLigneCmdEnabled = true; // activer le bouton ajouter ligne de commande
  addLigneReglmEnabled = true; // activer le bouton ajouter ligne de reglement
  confirmEnabled = false; // désactiver le bouton confirmer commande

  commandeForm: FormGroup;  // le formulaire général de la page (formulaire de la commande)
  fournisseurForm: FormGroup;
  produitForm: FormGroup;
  categorieForm: FormGroup;
  paiementForm: FormArray;

  get name() { return this.fournisseurForm.get('name') as FormControl; }

  get rip() { return this.fournisseurForm.get('rip') as FormControl; }

  get phone() { return this.fournisseurForm.get('phone') as FormControl; }

  get email() { return this.fournisseurForm.get('email') as FormControl; }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private commandeFournisseurService: CommandeFournisseurService,
    private fournisseurService: FournisseurService,
    private feedBackService: FeedBackService) {
  }

  ngOnInit() {
    this.initCurrentMagasin();

    // loading data using resolvers
    this.initMagasins();

    this.initFournisseurs();

    this.categories = this.route.snapshot.data.categories;

    if (this.categories[this.indiceCategorieSelectionne]) {
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;
    }

    // init atts
    if (this.produits[this.indiceProduitSelectionne]) {
      this.prixAchatLigneCommande = this.getSelectedLineDetails().prixAchat;
      this.prixVenteLigneCommande = this.getSelectedLineDetails().prixVente;
      this.quantiteLigneCommande = this.getSelectedLineDetails().quantite;
    }

    this.createForm();
    this.createFournisseurForm();
    this.createProduitForm();
    this.createCategorieForm();

  }

  getProductDetail(produit: ProduitE, id_magasin: number): DetailProduit {
    const d = produit.details.find(
      detail => detail.idMagasin === id_magasin
    );
    return d !== undefined ? d : null;
  }

  getSelectedLineDetails(): DetailProduit {
    return this.getProductDetail(this.produits[this.indiceProduitSelectionne], this.magasins[this.indiceMagasinSelectionne].idMagasin);
  }

  createForm() {
    this.commandeForm = this.formBuilder.group({
      fournisseur: 0,
      categorie: 0,
      produit: 0,
      magasin: 0,
      modeReglement: 'ESPECES',
    })
  }

  createFournisseurForm() {
    this.fournisseurForm = this.formBuilder.group({
      cin: '',
      name: ['', Validators.required],
      raison_sociale: '',
      rip: ['', Validators.min(0)],
      phone: ['', Validators.minLength(10)],
      address: '',
      email: ['', Validators.email],
    });
  }

  createProduitForm() {
    this.produitForm = this.formBuilder.group({
      libelle: '',
      prixDachat: 0,
      prixUnitaire: 0,
      quantite: 0,
      categorie: 0
    });
  }

  createCategorieForm() {
    this.categorieForm = this.formBuilder.group({
      label: '',
      description: ''
    });
  }

  resetCommandeForm() {
    // this.commandeForm.controls.fournisseur.setValue(0);
    // this.commandeForm.controls.categorie.setValue(0);
    this.indiceFournisseurSelectionne = 0;
    this.indiceMagasinSelectionne = 0;
    this.indiceCategorieSelectionne = 0;

    this.produits = this.categories[0].produits;

    this.indiceProduitSelectionne = 0;

    this.prixAchatLigneCommande = this.getProductDetail(this.produits[0], this.magasins[0].idMagasin).prixAchat;
    this.prixVenteLigneCommande = this.getProductDetail(this.produits[0], this.magasins[0].idMagasin).prixVente;
    this.quantiteLigneCommande = this.getProductDetail(this.produits[0], this.magasins[0].idMagasin).quantite;

    // this.commandeForm.controls.produit.setValue(0);
    this.montantTotalCmd = 0;
    this.montantTotalReglements = 0;
    this.commandeForm.controls.modeReglement.setValue('ESPECES');

    this.commandeTable = [];
    this.reglementTable = [];

    this.addLigneCmdEnabled = true;
    this.addLigneReglmEnabled = true;
    this.confirmEnabled = false;
  }

  initCurrentMagasin() {
    this.currentMagasin.nom = this.tokenStorageService.getMagasinName();
    this.currentMagasin.idMagasin = this.tokenStorageService.getMagasinId();
  }

  initMagasins() {
    this.magasins = this.route.snapshot.data.magasins;
  }

  initFournisseurs() {
    this.fournisseurs = this.route.snapshot.data.fournisseurs;
    this.fournisseurs.push(new FournisseurE(0, null, 0, null, 'مزود جديد ...'));
  }

  loadFournisseurs() {
    this.fournisseurService.getAll().subscribe(
      data => {
        this.fournisseurs = data;
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.FOURNISSEURS);
      }
    );
  }

  addFournisseur() {
    const fournisseurTemp = this.fournisseurForm.value;

    this.fournisseurService.add(fournisseurTemp).subscribe(
      res => {
        this.loadFournisseurs();
        this.indiceFournisseurSelectionne = this.fournisseurs.length - 1;
        this.feedBackService.feedBackInsert(OPERATION_TYPE.SUCCESS, COMPONENT_NAME.FOURNISSEUR);
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE, COMPONENT_NAME.FOURNISSEUR);
      }
    );
  }

  addProduit() {
    const produitFormTemp = this.produitForm.value;
    let categorieTemp = new CategorieE();

    if (this.isNewCategorie) {
      categorieTemp = this.categorieForm.value;
      this.categories.push(categorieTemp);
    } else {
      categorieTemp = this.categories[produitFormTemp.categorie];
    }
    this.isNewCategorie = false;

    this.commandeTable.push(new CommandeTable(
      new ProduitE(
        0, null, produitFormTemp.libelle, null, null,
        produitFormTemp.prixDachat, produitFormTemp.prixUnitaire,
        categorieTemp
      ),
      produitFormTemp.quantite,
      produitFormTemp.prixDachat * produitFormTemp.quantite
    ));

    this.montantTotalCmd += produitFormTemp.prixDachat * produitFormTemp.quantite;
    this.montantLigneReglement += produitFormTemp.prixDachat * produitFormTemp.quantite;
  }

  //  ajouter une ligne de commande (produit/quantité) au tableau commandeTable
  addCommandeLine() {
    let currentCommandeLigne = 0;

    const produitExistant = this.commandeTable.find(
      ligne => this.produits[this.indiceProduitSelectionne].libelle === ligne.produit.libelle
    );

    if (produitExistant) {
      currentCommandeLigne = this.commandeTable.indexOf(produitExistant);
      this.commandeTable[currentCommandeLigne].quantite += this.quantiteLigneCommande;
      this.commandeTable[currentCommandeLigne].somme += this.prixAchatLigneCommande * this.quantiteLigneCommande;

      this.montantTotalCmd += this.prixAchatLigneCommande * this.quantiteLigneCommande;

      this.montantLigneReglement += this.prixAchatLigneCommande * this.quantiteLigneCommande;
    } else {
      const commandeTableTemp = new CommandeTable(
        this.produits[this.indiceProduitSelectionne],
        this.quantiteLigneCommande,
        this.prixAchatLigneCommande * this.quantiteLigneCommande
      );
      this.commandeTable.push(commandeTableTemp); // ajouter cette ligne de commande au tableau général des commandes

      this.montantTotalCmd = this.montantTotalCmd + commandeTableTemp.somme; // calcul du nouveau montant total de la commande

      this.montantLigneReglement += commandeTableTemp.somme;
    }

    /*
    this.qts_prods_cat[this.indiceProduitSelectionne] -= this.quantiteLigneCommande;
    */
    /***
     this.quantiteLigneCommande = this.qts_prods_cat[this.indiceProduitSelectionne];
     */
  }

  //  supprimer une ligne de commande
  deleteCommandeLine(index) {

    // retrait de la somme de ligne de commande à partir du montant total de la commande
    this.montantTotalCmd -= this.commandeTable[index].somme;

    // retrait de la somme de ligne de commande à partir du montant de paiemnet restant
    this.montantLigneReglement -= this.commandeTable[index].somme;

    const produitExistant = this.categories.find(categorie => {
      return categorie.produits.find(produit => {
        if (produit.idProduit === this.commandeTable[index].produit.idProduit) {
          const indiceProd = categorie.produits.indexOf(produit);
          /*
          categorie.quantites[indiceProd] += this.commandeTable[index].quantite;
          */
          /***if (this.produits[this.indiceProduitSelectionne] === produit) {
            this.quantiteLigneCommande = categorie.quantites[indiceProd];
          }*/
          return true;
        }
        return false;
      }) === null;
    });

    this.commandeTable.splice(index, 1); // suppression de ligne de commande à partir du tableau
  }

  //  ajouter une ligne de reglement (paiement) (monatant/méthode) au tableau reglementTable
  addPaymentLine() {

    if (this.montantTotalReglements === this.montantTotalCmd) {
      this.feedBackService.feedBackCustom('إضافة طريقة الدفع', 'لا يمكن إضافة طريقة الدفع ، لأن المبلغ مكتمل', 'error');
      return;
    }

    const reglementTableTemp: ReglementClientE = new ReglementClientE(null, null, this.modeLigneReglement, this.montantLigneReglement);
    this.reglementTable.push(reglementTableTemp);

    this.montantTotalReglements += this.montantLigneReglement;
    this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;

    if (this.montantTotalCmd === this.montantTotalReglements) {
      // teste du total de la commande et le total qui a été payé pour valider la commande
      this.confirmEnabled = true;
      this.addLigneReglmEnabled = false;
    }

  }

  deletePaymentLine(index: number) {

    this.montantTotalReglements -= this.reglementTable[index].montant;
    this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;
    this.reglementTable.splice(index, 1); // supprimer les données sélectionnées

    if (this.montantTotalCmd === this.montantTotalReglements) {
      // teste du total de la commande et le total qui a été payé pour valider la commande
      this.confirmEnabled = false;
      this.addLigneReglmEnabled = true;
    }
  }

  getModeReglementEnum(mode: string): ModeReglementEnum {
    switch (mode) {
      case 'ESPECES':
        return ModeReglementEnum.ESPECES;
      case 'CHEQUE':
        return ModeReglementEnum.CHEQUE;
      case 'EFFET':
        return ModeReglementEnum.EFFET;
      case 'VIREMENT_BANCAIRE':
        return ModeReglementEnum.VIREMENT_BANCAIRE;
      case 'CREDIT':
        return ModeReglementEnum.CREDIT;
      case 'N_EST_PAS_INCLUS':
        return ModeReglementEnum.N_EST_PAS_INCLUS;

      default:
        return ModeReglementEnum.ESPECES;
    }
  }

  getModeReglement(mode: ModeReglementEnum): string {
    switch (mode) {
      case ModeReglementEnum.ESPECES:
        return 'نقد';
      case ModeReglementEnum.CHEQUE:
        return 'شيك';
      case ModeReglementEnum.EFFET:
        return '(Effet) كمبيالة';
      case ModeReglementEnum.VIREMENT_BANCAIRE:
        return 'حوالة مصرفية';
      case ModeReglementEnum.CREDIT:
        return 'سلف';
      case ModeReglementEnum.N_EST_PAS_INCLUS:
        return 'معاملة';

      default:
        return 'نقد';
    }
  }

  magasinSelectChange(args) {
    this.indiceMagasinSelectionne = args.target.value;  // indice de la categorie sélectionnée
    const detail = this.getSelectedLineDetails();
    if (detail !== null) {
      this.prixAchatLigneCommande = detail.prixAchat;
      this.prixVenteLigneCommande = detail.prixVente;
      this.quantiteLigneCommande = detail.quantite;
    } else {
      this.prixAchatLigneCommande = this.prixVenteLigneCommande = this.quantiteLigneCommande = -1;
    }
  }

  categorieSelectChange(args) {
    this.indiceCategorieSelectionne = args.target.value;  // indice de la categorie sélectionnée

    if (this.categories[this.indiceCategorieSelectionne]) {
      // remplir le tebleau des produits
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;
      // chargement de la liste des quantités des produits de la catégorie sélectionnée
      /*
      this.qts_prods_cat = this.categories[this.indiceCategorieSelectionne].quantites;
      */
    }

    this.indiceProduitSelectionne = 0;  // réinitialiser l'indice de produit sélectionné
    this.commandeForm.controls.produit.setValue(0);  // réinitialiser l'indice de produit sélectionné
    if (this.produits[0]) {
      this.indiceMagasinSelectionne = 0;
      this.commandeForm.controls.magasin.setValue(0);
      const detail = this.getSelectedLineDetails();

      this.prixAchatLigneCommande = detail.prixAchat;
      this.prixVenteLigneCommande = detail.prixVente;
      this.quantiteLigneCommande = detail.quantite;
    } else {
      this.feedBackService.feedBackCustom('تحميل معلومات',
        'خطأ في تحميل المنتجات للفئة المختارة ' + this.categories[this.indiceCategorieSelectionne].label,
        'error'
      );
    }
  }

  produitSelectChange(args) {
    this.indiceProduitSelectionne = args.target.value; // indice du produit sélectionné

    if (this.produits[this.indiceProduitSelectionne]) {
      this.indiceMagasinSelectionne = 0;
      this.commandeForm.controls.magasin.setValue(0);
      const detail = this.getSelectedLineDetails();

      this.prixAchatLigneCommande = detail.prixAchat;
      this.prixVenteLigneCommande = detail.prixVente;
      this.quantiteLigneCommande = detail.quantite;
    } else {
      this.feedBackService.feedBackCustom('تحميل معلومات',
        'خطأ في تحميل المنتجات للفئة المختارة ' + this.categories[this.indiceCategorieSelectionne].label,
        'error'
      );
    }
  }

  fournisseurSelectChange(args) {
    this.indiceFournisseurSelectionne = args.target.value; // indice du fournisseur sélectionné

    if (this.fournisseurs[this.indiceFournisseurSelectionne].name === 'مزود جديد ...') {
      document.getElementById('openModalButton').click();
    }
  }

  reglementSelectChange(args) {
    this.modeLigneReglement = this.getModeReglementEnum(args.target.value); // indice du mode de paiement sélectionné

    if (this.modeLigneReglement === ModeReglementEnum.CREDIT) {
      // ajouter le credit au client selectionne en haut
    }
  }

  prixAchatLigneCommandeFocusOut() {
    // if (this.prixAchatLigneCommande <= 0) {
    //   this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن المنتج أقل من الصفر ؟؟؟', 'error');
    //   document.getElementById('prixProduit').className = 'form-control tc-form-control-error';
    //   this.addLigneCmdEnabled = false;
    // } else {
    //   document.getElementById('prixProduit').className = 'form-control';
    //   this.addLigneCmdEnabled = true;
    // }
  }

  prixVenteLigneCommandeFocusOut() {
    // if (this.prixVenteLigneCommande <= 0) {
    //   this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن المنتج أقل من الصفر ؟؟؟', 'error');
    //   document.getElementById('prixProduit').className = 'form-control tc-form-control-error';
    //   this.addLigneCmdEnabled = false;
    // } else {
    //   document.getElementById('prixProduit').className = 'form-control';
    //   this.addLigneCmdEnabled = true;
    // }
  }

  quantiteLigneCommandeFocusOut(arg) {
    /*
    const quantiteOrigine = this.categories[this.indiceCategorieSelectionne].quantites[this.indiceProduitSelectionne];
    */
    // const quantiteOrigine = this.getSelectedLineDetails().quantite;
    // const quantiteInput = arg.target.value;

    // if (quantiteInput <= 0) {
    //   this.feedBackService.feedBackCustom('كمية المنتج', 'كمية المنتج أقل من الصفر ؟؟؟', 'error');
    //   document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
    //   this.addLigneCmdEnabled = false;
    // } else if (quantiteInput > quantiteOrigine) {
    //   this.feedBackService.feedBackCustom('كمية المنتج', 'الكمية المطلوبة تتجاوز الكمية المتاحة في المخزون', 'error');
    //   document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
    //   this.addLigneCmdEnabled = false;
    // } else {
    //   document.getElementById('quantitProduit').className = 'form-control';
    //   this.addLigneCmdEnabled = true;
    // }
  }

  isAddLigneCmdBtnEnabled(): boolean {
    /*
    const quantiteOrigine = this.categories[this.indiceCategorieSelectionne].quantites[this.indiceProduitSelectionne];
    */
    /*const quantiteOrigine = this.getSelectedLineDetails().quantite;

    if (this.prixAchatLigneCommande <= 0) {
      this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن المنتج أقل من الصفر.', 'error');
      return false;
    }
    if (this.quantiteLigneCommande <= 0) {
      this.feedBackService.feedBackCustom('كمية المنتج', 'كمية المنتج أقل من الصفر ؟؟؟', 'error');
      return false;
    }
    if (this.quantiteLigneCommande > quantiteOrigine) {
      this.feedBackService.feedBackCustom('كمية المنتج', 'الكمية المطلوبة تتجاوز الكمية المتاحة في المخزون', 'error');
      return false;
    }*/

    return true;
  }

  sortCommandeTableByProduitId() {
    this.commandeTable.sort((a, b) => {
      if (a.produit.idProduit > b.produit.idProduit) {
        return (b.produit.idProduit !== 0) ? 1 : -1;
      }
      return (a.produit.idProduit === 0) ? 1 : -1;
    });
  }

  genereFacture() {
    this.confirmEnabled = false;
    const cmd = new CommandeFournisseurAddingRequest();

    cmd.dateCmdF = new Date();
    cmd.montantTotal = this.montantTotalCmd;
    cmd.fournisseur = new FournisseurE();
    cmd.fournisseur.idFournisseur = this.fournisseurs[this.indiceFournisseurSelectionne].idFournisseur;
    cmd.reglements = [];
    cmd.lignesCmdFournisseur = [];

    this.sortCommandeTableByProduitId();

    this.commandeTable.forEach(element => {
      const ligne = new LigneCmdFournisseurE(null, element.quantite, null,
        element.produit);
      cmd.lignesCmdFournisseur.push(ligne);
    });

    this.reglementTable.forEach(element => {
      cmd.reglements.push(element);
    });

    cmd.idMagasin = this.currentMagasin.idMagasin;

    this.commandeFournisseurService.add(cmd).subscribe(
      data => {
        this.feedBackService.feedBackCustom('إضافة طلب', 'تم تمرير هذا الطلب بنجاح', 'success');
        this.resetCommandeForm();
      },
      error => {
        this.feedBackService.feedBackCustom('إضافة طلب', 'تعذر تمرير هذا الطلب', 'error');
      });
  }
}
