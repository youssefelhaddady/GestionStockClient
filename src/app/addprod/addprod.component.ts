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
import { BillGeneratorService } from 'app/config/BillGenerator.service';

@Component({
  selector: 'app-addprod',
  templateUrl: './addprod.component.html',
  styleUrls: ['./addprod.component.scss']
})
export class AddprodComponent implements OnInit {
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

  addLigneCmdEnabled = false; // désactiver le bouton ajouter ligne de commande
  addLigneReglmEnabled = true; // activer le bouton ajouter ligne de reglement
  confirmEnabled = false; // désactiver le bouton confirmer commande

  commandeForm: FormGroup;  // le formulaire général de la page (formulaire de la commande)
  fournisseurForm: FormGroup;
  produitForm: FormGroup;
  categorieForm: FormGroup;
  paiementForm: FormArray;

  reset: String;

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
    private feedBackService: FeedBackService,
    private billGeneratorService: BillGeneratorService) {
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
    if (this.produits[this.indiceProduitSelectionne] !== undefined && this.produits[this.indiceProduitSelectionne]) {
      this.setValuesFromDetails();
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

  getSelectedLineDetail(): DetailProduit {
    return this.getProductDetail(this.produits[this.indiceProduitSelectionne], this.magasins[this.indiceMagasinSelectionne].idMagasin);
  }

  setValuesFromDetails() {
    const detail = this.getSelectedLineDetail();
    if (detail !== null) {
      this.prixAchatLigneCommande = detail.prixAchat;
      this.prixVenteLigneCommande = detail.prixVente;
      this.quantiteLigneCommande = detail.quantite;
    } else {
      this.prixAchatLigneCommande = this.prixVenteLigneCommande = this.quantiteLigneCommande = -1;
    }
  }

  createForm() {
    this.commandeForm = this.formBuilder.group({
      fournisseur: 0,
      categorie: 0,
      produit: 0,
      magasin: 0,
      modeReglement: 'ESPECES',
    });
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
      categorie: 0,
      magasin: 0
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
    this.indiceCategorieSelectionne = 0;
    this.indiceMagasinSelectionne = 0;

    this.produits = this.categories[0].produits;

    this.indiceProduitSelectionne = 0;

    this.setValuesFromDetails();

    this.montantTotalCmd = 0;
    this.montantTotalReglements = 0;
    this.montantLigneReglement = 0;
    this.commandeForm.controls.modeReglement.setValue('ESPECES');

    this.commandeTable = [];
    this.reglementTable = [];

    this.addLigneCmdEnabled = false;
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

  getCategorieByLabel(label: string): CategorieE {
    const catRslt = this.categories.find(cat => cat.label === label);
    return catRslt === undefined ? null : catRslt;
  }

  getProductFromCategorie(produit: string, categorie: string): ProduitE {
    const searchedCat = this.getCategorieByLabel(categorie);
    if (searchedCat !== null && searchedCat.produits !== undefined && searchedCat.produits !== null) {
      const prodRslt = searchedCat.produits.find(prod => prod.libelle === produit);
      return prodRslt === undefined ? null : prodRslt;
    }
    return null;
  }

  refreshMontantTotalCmd() {
    this.montantTotalCmd = 0;
    this.commandeTable.forEach(cmd =>
      this.montantTotalCmd += cmd.somme
    );
    this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;
  }

  refreshMontantTotalReglements() {
    this.montantTotalReglements = 0;
    this.reglementTable.forEach(cmd =>
      this.montantTotalReglements += cmd.montant
    );
    this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;
  }

  addProduit() {
    const produitFormTemp = this.produitForm.value;
    let categorieTemp = new CategorieE();
    const newProd = new ProduitE(0, null, produitFormTemp.libelle, null, null, null, null, null, []);

    // test si l'utilisateur veut une nouvelle categorie
    if (this.isNewCategorie) {
      // test si cette nouvelle catégorie n'est pas déjà existant avec les anciennes catégories
      categorieTemp = this.categorieForm.value;
      if (this.getCategorieByLabel(categorieTemp.label) === null) {
        this.categories.push(categorieTemp);
      }
    } else {
      categorieTemp = this.categories[produitFormTemp.categorie];
    }
    this.isNewCategorie = false;

    newProd.categorie = new CategorieE(categorieTemp.idCategorie, categorieTemp.label);
    // test si le produit n'est pas un produit de la catégorie sélectionnée
    if (this.getProductFromCategorie(produitFormTemp.libelle, categorieTemp.label) === null) {
      // ajouter ce produit au tableau des produit de cette categorie
      const cat = this.getCategorieByLabel(categorieTemp.label);
      if (cat !== null) {
        // ils arrivent que les produits de cette catégorie soient undefined ou bien null
        if (cat.produits === undefined || cat.produits === null) {
          cat.produits = [];
        }
        cat.produits.push(newProd);
      }
    }

    // en utilisant ce ligne/magasin on ajoute le produit/ligneCmd au magasin selection dans la ligne de cmd
    // const mag = this.magasins[produitFormTemp.magasin]
    // en utilisant ce ligne/magasin on ajout le produit/ligneCmd au magasin courant (de l'utilisateur courant)
    const mag = this.currentMagasin
    newProd.details.push(new DetailProduit(
      mag.idMagasin, null,
      produitFormTemp.prixDachat, produitFormTemp.prixUnitaire, produitFormTemp.quantite
    ));

    this.commandeTable.push(new CommandeTable(
      newProd, produitFormTemp.prixDachat,
      produitFormTemp.prixUnitaire, produitFormTemp.quantite,
      produitFormTemp.prixDachat * produitFormTemp.quantite, mag
    ));

    this.refreshMontantTotalCmd();
  }

  //  ajouter une ligne de commande (produit/quantité) au tableau commandeTable
  addCommandeLine() {

    const commandeExistant = this.commandeTable.find(
      // on cherche le produit par son libelle car on peut trouver des produits sans id (les nouveau qui ont un id = 0)
      ligne => (ligne.produit.libelle === this.produits[this.indiceProduitSelectionne].libelle
        && ligne.magasin.idMagasin === this.magasins[this.indiceMagasinSelectionne].idMagasin)
    );

    if (commandeExistant) {
      const currentCommandeLigne = this.commandeTable.indexOf(commandeExistant);
      this.commandeTable[currentCommandeLigne].prixAchat = this.prixAchatLigneCommande;
      this.commandeTable[currentCommandeLigne].prixVente = this.prixVenteLigneCommande;
      this.commandeTable[currentCommandeLigne].quantite = this.quantiteLigneCommande;
      this.commandeTable[currentCommandeLigne].somme = this.prixAchatLigneCommande * this.quantiteLigneCommande;

    } else {
      // ajouter ce produit au tableau général des commandeTable
      const addedProd = new ProduitE(
        this.produits[this.indiceProduitSelectionne].idProduit, null, this.produits[this.indiceProduitSelectionne].libelle,
        null, null, null, null, null, []
      );
      addedProd.categorie = new CategorieE(this.categories[this.indiceCategorieSelectionne].idCategorie,
        this.categories[this.indiceCategorieSelectionne].label
      );
      addedProd.details.push(
        new DetailProduit(this.magasins[this.indiceMagasinSelectionne].idMagasin, null,
          this.prixAchatLigneCommande, this.prixVenteLigneCommande, this.quantiteLigneCommande
        ));
      this.commandeTable.push(new CommandeTable(addedProd, this.prixAchatLigneCommande,
        this.prixVenteLigneCommande, this.quantiteLigneCommande,
        this.prixAchatLigneCommande * this.quantiteLigneCommande, this.magasins[this.indiceMagasinSelectionne]
      ));
    }

    this.refreshMontantTotalCmd(); // calcul du nouveau montant total de la commande
  }

  //  supprimer une ligne de commande
  deleteCommandeLine(index) {

    // const produitExistant = this.categories.find(categorie => {
    //   return categorie.produits.find(produit => {
    //     if (produit.idProduit === this.commandeTable[index].produit.idProduit) {
    //       const indiceProd = categorie.produits.indexOf(produit);
    //       /*
    //       categorie.quantites[indiceProd] += this.commandeTable[index].quantite;
    //       */
    //       /***if (this.produits[this.indiceProduitSelectionne] === produit) {
    //         this.quantiteLigneCommande = categorie.quantites[indiceProd];
    //       }*/
    //       return true;
    //     }
    //     return false;
    //   }) === null;
    // });

    this.commandeTable.splice(index, 1); // suppression de ligne de commande à partir du tableau
    this.refreshMontantTotalCmd();
  }

  //  ajouter une ligne de reglement (paiement) (monatant/méthode) au tableau reglementTable
  addPaymentLine() {

    // if (this.montantTotalReglements === this.montantTotalCmd) {
    //   this.feedBackService.feedBackCustom('إضافة طريقة الدفع', 'لا يمكن إضافة طريقة الدفع ، لأن المبلغ مكتمل', 'error');
    //   return;
    // }

    const reglementTableTemp: ReglementClientE = new ReglementClientE(0, null, this.modeLigneReglement, this.montantLigneReglement);
    const reglementExistant = this.reglementTable.find(
      ligne => (ligne.mode === this.modeLigneReglement)
    );
    if (reglementExistant) {
      const currentReglementLigne = this.reglementTable.indexOf(reglementExistant);
      this.reglementTable[currentReglementLigne].montant += this.montantLigneReglement;
    } else {
      this.reglementTable.push(reglementTableTemp);
    }

    // this.montantTotalReglements += this.montantLigneReglement;
    // this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;

    // if (this.montantTotalCmd === this.montantTotalReglements) {
    //   // teste du total de la commande et le total qui a été payé pour valider la commande
    //   this.confirmEnabled = true;
    //   this.addLigneReglmEnabled = false;
    // }

    this.refreshMontantTotalReglements();
    this.refreshConfirmEnablibilty();
  }

  deletePaymentLine(index: number) {

    // this.montantTotalReglements -= this.reglementTable[index].montant;
    // this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;
    this.reglementTable.splice(index, 1); // supprimer les données sélectionnées

    // if (this.montantTotalCmd === this.montantTotalReglements) {
    //   // teste du total de la commande et le total qui a été payé pour valider la commande
    //   this.confirmEnabled = false;
    //   this.addLigneReglmEnabled = true;
    // }
    this.refreshMontantTotalReglements();
    this.refreshConfirmEnablibilty();
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
    this.setValuesFromDetails();
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
      this.setValuesFromDetails();
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
      this.setValuesFromDetails();
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
  }

  refreshAddLigneCmdEnability() {
    this.addLigneCmdEnabled = true;
    if (this.prixAchatLigneCommande <= 0
      || this.prixVenteLigneCommande <= 0 || this.prixVenteLigneCommande < this.prixAchatLigneCommande
      || this.quantiteLigneCommande <= 0) {
      this.addLigneCmdEnabled = false;
    }
  }

  refreshAddLigneReglmEnability(value: number) {
    this.addLigneReglmEnabled = true;
    if (value <= 0 || ((value + this.montantTotalReglements) > this.montantTotalCmd)) {
      this.addLigneReglmEnabled = false;
    }
  }

  refreshConfirmEnablibilty() {
    this.confirmEnabled = false;
    if (this.commandeTable.length > 0 && this.montantTotalReglements === this.montantTotalCmd) {
      this.confirmEnabled = true;
    }
  }

  prixAchatLigneCommandeFocusOut() {
    if (this.prixAchatLigneCommande <= 0) {
      this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن المنتج أقل من الصفر ؟؟؟', 'error');
      document.getElementById('prixAchat').className = 'form-control tc-form-control-error';
    } else {
      document.getElementById('prixAchat').className = 'form-control';
    }
    this.refreshAddLigneCmdEnability();
  }

  prixVenteLigneCommandeFocusOut() {
    if (this.prixVenteLigneCommande <= 0) {
      this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن المنتج أقل من الصفر ؟؟؟', 'error');
      document.getElementById('prixVente').className = 'form-control tc-form-control-error';
    } else if (this.prixVenteLigneCommande < this.prixAchatLigneCommande) {
      this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن شراء المنتج أقل من ثمن البيع ؟؟؟', 'error');
      document.getElementById('prixVente').className = 'form-control tc-form-control-error';
    } else {
      document.getElementById('prixVente').className = 'form-control';
    }
    this.refreshAddLigneCmdEnability();
  }

  quantiteLigneCommandeFocusOut(event) {
    this.quantiteLigneCommande = event.target.value;
    this.reset = '';
    /*
    const quantiteOrigine = this.categories[this.indiceCategorieSelectionne].quantites[this.indiceProduitSelectionne];
    */
    // const quantiteOrigine = this.getSelectedLineDetails().quantite;
    // const quantiteInput = arg.target.value;

    if (this.quantiteLigneCommande <= 0) {
      this.feedBackService.feedBackCustom('كمية المنتج', 'كمية المنتج أقل من الصفر ؟؟؟', 'error');
      document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
      // } else if (quantiteInput > quantiteOrigine) {
      //   this.feedBackService.feedBackCustom('كمية المنتج', 'الكمية المطلوبة تتجاوز الكمية المتاحة في المخزون', 'error');
      //   document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
      //   this.addLigneCmdEnabled = false;
    } else {
      document.getElementById('quantitProduit').className = 'form-control';
    }
    this.refreshAddLigneCmdEnability();
  }

  montantLigneReglementFocusOut(event) {
    const inputMontant = Number(event.target.value);

    if (inputMontant <= 0) {
      this.feedBackService.feedBackCustom('مبلغ الدفع', 'المبلغ المدفوع أقل من الصفر ؟؟؟', 'error');
      document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
    } else if (inputMontant + this.montantTotalReglements > this.montantTotalCmd) {
      this.feedBackService.feedBackCustom('مبلغ الدفع', 'المبالغ المدفوعة أكبر من المبلغ الإجمالي للطلب', 'error');
      document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
    } else {
      document.getElementById('quantitProduit').className = 'form-control';
    }

    this.refreshAddLigneReglmEnability(inputMontant);
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
    const cmd = new CommandeFournisseurAddingRequest();

    cmd.dateCmdF = new Date();
    cmd.montantTotal = this.montantTotalCmd;
    cmd.fournisseur = new FournisseurE();
    cmd.fournisseur.idFournisseur = this.fournisseurs[this.indiceFournisseurSelectionne].idFournisseur;
    cmd.fournisseur.name = this.fournisseurs[this.indiceFournisseurSelectionne].name;
    cmd.reglements = [];
    cmd.lignesCmdFournisseur = [];

    this.sortCommandeTableByProduitId();

    this.commandeTable.forEach(element => {
      const ligne = new LigneCmdFournisseurE(null, element.quantite, null,
        element.produit);
      cmd.lignesCmdFournisseur.push(ligne);
    });

    this.reglementTable.sort((a, b) => (a.montant > b.montant) ? -1 : 1)
    this.reglementTable.forEach(element => {
      cmd.reglements.push(element);
    });

    cmd.idMagasin = this.currentMagasin.idMagasin;

    this.commandeFournisseurService.add(cmd).subscribe(
      data => {
        cmd.codeCmdF = data.message;
        this.billGeneratorService.generatePdf('F', cmd, this.commandeTable, this.reglementTable, this.currentMagasin.nom);
        this.feedBackService.feedBackCustom('إضافة طلب', 'تم تمرير هذا الطلب بنجاح', 'success');
        this.resetCommandeForm();
      },
      // message d'erreur
      error => {
        this.feedBackService.feedBackCustom('إضافة طلب', 'تعذر تمرير هذا الطلب', 'error');
    });
  }
}
