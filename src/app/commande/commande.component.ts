import { ActivatedRoute } from '@angular/router';
import { CategorieE } from '../exchange/e_categorie';
import { ClientE } from '../exchange/e_client';
import { ClientService } from './../shared/services/client.service';
import { CommandeClientService } from './../shared/services/commande_client.service';
import { CommandeClientAddingRequest } from '../exchange/e_commande_client';
import { Component, OnInit } from '@angular/core';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LigneCmdClientE } from './../exchange/e_ligne_cmd_client';
import { MagasinE } from './../exchange/e_magasin';
import { ModeReglementEnum } from 'app/exchange/mode_reglement_enum';
import { ProduitE } from '../exchange/e_produit';
import { ReglementClientE } from '../exchange/e_reglement_client';
import { TokenStorageService } from 'app/auth/token.storage.service';
import { DetailProduit } from 'app/exchange/e_detail_produit';
import { CommandeTable } from 'app/exchange/e_commande_fournisseur';
import { BillGeneratorService } from 'app/config/BillGenerator.service';

// pdfMake.fonts = {
//   DroidKufi: {
//     normal: 'DroidKufi-Regular.ttf',
//     bold: 'DroidKufi-Regular.ttf',
//     italics: 'DroidKufi-Regular.ttf',
//     bolditalics: 'DroidKufi-Regular.ttf'
//   },
//   Roboto: {
//     normal: 'Roboto-Regular.ttf',
//     bold: 'Roboto-Medium.ttf',
//     italics: 'Roboto-Italic.ttf',
//     bolditalics: 'Roboto-Italic.ttf'
//   }
// }

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})

export class CommandeComponent implements OnInit {

  currentDateTime = Date.now(); // La date d'aujourd'hui
  currentMagasin = new MagasinE(); // le magasin lié à l'USER de l'app

  /* magasin */
  magasins: MagasinE[] = [];  // tableau des magasins
  indiceMagasinSelectionne = 0; // selectionnement de magasin

  /* Client */
  clients: ClientE[] = [];  // tableau des clients
  indiceClientSelectionne = 0; // selectionnement de client

  fraisLivraison = false; // boolean indiquant que les frais de livraison sont incluses (pour ajouter ces frais aux chargues)

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


  addLigneCmdEnabled = false; // désactiver le bouton ajouter ligne de commande
  addLigneReglmEnabled = true; // activer le bouton ajouter ligne de reglement
  confirmEnabled = false; // désactiver le bouton confirmer commande

  currentCommandeLigne: number;

  commandeForm: FormGroup;  // le formulaire général de la page (formulaire de la commande)
  paiementForm: FormArray;  // formegroupe de la partie paiement
  clientForm: FormGroup;

  reset: String;

  get name() { return this.clientForm.get('name') as FormControl; }

  get rip() { return this.clientForm.get('rip') as FormControl; }

  get phone() { return this.clientForm.get('phone') as FormControl; }

  get email() { return this.clientForm.get('email') as FormControl; }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private commandeClientService: CommandeClientService,
    private clientService: ClientService,
    private feedBackService: FeedBackService,
    private billGeneratorService: BillGeneratorService
    ) {
  }

  ngOnInit() {
    this.initCurrentMagasin();

    // loading data using resolvers
    this.initMagasins();

    this.initClients();
    this.categories = this.route.snapshot.data.categories;

    if (this.categories[this.indiceCategorieSelectionne]) {
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;
    }

    // init atts
    if (this.produits[this.indiceProduitSelectionne] !== undefined && this.produits[this.indiceProduitSelectionne]) {
      this.setValuesFromDetails();
    }

    this.createForm();
    this.createClientForm();

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
      client: 0,
      livraison: false,
      categorie: 0,
      produit: 0,
      magasin: 0,
      modeReglement: 'ESPECES',
    })
  }

  createClientForm() {
    this.clientForm = this.formBuilder.group({
      cin: '',
      name: ['', Validators.required],
      raison_sociale: '',
      rip: ['', Validators.min(0)],
      phone: ['', Validators.minLength(10)],
      address: '',
      email: ['', Validators.email],
    });
  }

  /*createPaiementFormItem(): FormGroup {
    return this.formBuilder.group({
      // montantReglement: 0,
      modeReglement: 'ESPECES',
    });
  }

  addPaiementFormItem(): void {
    this.modeLigneReglement = ModeReglementEnum.ESPECES;
    this.paiementForm = this.commandeForm.get('paiementForm') as FormArray;
    this.paiementForm.push(this.createPaiementFormItem());
  }

  removePaiementFormItem(index: number): void {
    this.paiementForm.removeAt(index);
  }*/

  resetCommandeForm() {
    // this.commandeForm.controls.client.setValue(0);
    // this.commandeForm.controls.livraison.setValue(false);
    // this.commandeForm.controls.categorie.setValue(0);
    this.indiceClientSelectionne = 0;
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

  /*loadQuatitiesForTheCurrentCategorie() {
    const id = this.categories[this.indiceCategorieSelectionne].idCategorie;
    this.mouvementStockService.getQtByMagProd(id).subscribe(
      data => {
        this.qts_prods_cat = data;
      },
      error => {
        console.log(error);
      });
  }*/

  initClients() {
    this.clients = this.route.snapshot.data.clients;
    this.clients.push(new ClientE(0, null, null, 0, null, 'زبون جديد ...'));
  }

  loadClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clients = data;
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.CLIENTS);
      }
    );
  }

  addClient() {
    const clientTemp = this.clientForm.value;

    this.clientService.add(clientTemp).subscribe(
      res => {
        // reloading Client's data
        this.loadClients();
        this.indiceClientSelectionne = this.clients.length - 1;
        this.feedBackService.feedBackInsert(OPERATION_TYPE.SUCCESS, COMPONENT_NAME.CLIENT);
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE, COMPONENT_NAME.CLIENT);
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

  //  ajouter une ligne de commande (produit/quantité) au tableau commandeTable
  addCommandeLine() {
    // this.generatePdf(new CommandeClientAddingRequest());

    const commandeExistant = this.commandeTable.find(
      // on cherche le produit par son libelle car on peut trouver des produits sans id (les nouveau qui ont un id = 0)
      ligne => (ligne.produit.libelle === this.produits[this.indiceProduitSelectionne].libelle
        && ligne.magasin.idMagasin === this.magasins[this.indiceMagasinSelectionne].idMagasin)
    );

    if (commandeExistant) {
      // si le produit est déjà existant dans le tableau des commande on va seulement changer la quantité et les prix
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

    // // retrait de la somme de ligne de commande à partir du montant total de la commande
    // this.montantTotalCmd -= this.commandeTable[index].somme;

    // // retrait de la somme de ligne de commande à partir du montant de paiement restant
    // this.montantLigneReglement -= this.commandeTable[index].somme;

    // const categorieExistante = this.categories.find(categorie => categorie.label === this.commandeTable[index].categorieName);
    // const produitExistant = categorieExistante.produits.find(produit => produit.idProduit === this.commandeTable[index].productId);
    // const indiceProd = categorieExistante.produits.indexOf(produitExistant);

    // if (categorieExistante) {
    //   categorieExistante.quantites[indiceProd] += this.commandeTable[index].quantite;

    //   if (this.produits[this.indiceProduitSelectionne] === produitExistant) {
    //     this.quantiteLigneCommande = categorieExistante.quantites[indiceProd];
    //   }
    // }

    this.commandeTable.splice(index, 1); // suppression de ligne de commande à partir du tableau
    this.refreshMontantTotalCmd();
  }


  //  ajouter une ligne de reglement (paiement) (monatant/méthode) au tableau reglementTable
  addPaymentLine() {

    // if (this.montantTotalReglements === this.montantTotalCmd) {
    //   // teste du total de la commande et le total qui a été payé pour valider la commande
    //   this.feedBackService.feedBackCustom('إضافة طريقة الدفع', 'لا يمكن إضافة طريقة الدفع ، لأن المبلغ مكتمل', 'error');
    //   return;
    // }

    const reglementTableTemp: ReglementClientE = new ReglementClientE(null, null, this.modeLigneReglement, this.montantLigneReglement);
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

    // if (this.montantTotalReglements >= this.montantTotalCmd) {
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

    // if (this.montantTotalCmd > this.montantTotalReglements) {
    //   // teste du total de la commande et le total qui a été payé pour valider la commande
    //   this.confirmEnabled = false;
    //   this.addLigneReglmEnabled = true;
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

  clientSelectChange(args) {
    this.indiceClientSelectionne = args.target.value; // indice du client sélectionné

    if (this.clients[this.indiceClientSelectionne].name === 'زبون جديد ...') {
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

    let quantiteOrigine = 0;
    if (this.getSelectedLineDetail() !== undefined && this.getSelectedLineDetail()) {
      quantiteOrigine = this.getSelectedLineDetail().quantite;
    }

    if (this.quantiteLigneCommande <= 0) {
      this.feedBackService.feedBackCustom('كمية المنتج', 'كمية المنتج أقل من الصفر ؟؟؟', 'error');
      document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
    } else if (this.quantiteLigneCommande > quantiteOrigine) {
      this.feedBackService.feedBackCustom('كمية المنتج', 'الكمية المطلوبة تتجاوز الكمية المتاحة في المخزون', 'error');
      document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
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

  getNonIncludedMode(): number {
    let somme = 0;
    this.reglementTable.find(element => {
      if (element.mode === ModeReglementEnum.N_EST_PAS_INCLUS || element.mode === ModeReglementEnum.CREDIT) {
        somme += element.montant;
        return false;
      }
      return false;
    });
    return somme;
  }


  genereFacture() {
    const cmd = new CommandeClientAddingRequest();

    cmd.dateCmd = new Date();
    cmd.montantPaye = this.montantTotalCmd - this.getNonIncludedMode();
    cmd.montantTotal = this.montantTotalCmd;
    cmd.livraison = this.fraisLivraison;
    cmd.client = new ClientE();
    cmd.client.idClient = this.clients[this.indiceClientSelectionne].idClient;
    cmd.client.name = this.clients[this.indiceClientSelectionne].name;
    cmd.reglements = [];
    cmd.lignesCmdClient = [];

    // ordonner la table en id croissant
    this.commandeTable.sort((a, b) => (a.produit.idProduit > b.produit.idProduit) ? 1 : -1)

    this.commandeTable.forEach(element => {
      const ligne = new LigneCmdClientE(0, element.quantite, element.quantite, null, element.produit);
      cmd.lignesCmdClient.push(ligne);
    });

    this.reglementTable.sort((a, b) => (a.montant > b.montant) ? -1 : 1)
    this.reglementTable.forEach(element => {
      cmd.reglements.push(element);
    });

    cmd.idMagasin = this.currentMagasin.idMagasin;

    this.commandeClientService.add(cmd).subscribe(
      data => {
        cmd.codeCmd = data.message;
        this.billGeneratorService.generatePdf('C', cmd, this.commandeTable, this.reglementTable, this.currentMagasin.nom);
        // console.log(cmd);
        this.feedBackService.feedBackCustom('إضافة طلب', 'تم تمرير هذا الطلب بنجاح', 'success');
        this.resetCommandeForm();
      },
      error => {
        this.feedBackService.feedBackCustom('إضافة طلب', 'تعذر تمرير هذا الطلب', 'error');
      }
    );
  }
}
