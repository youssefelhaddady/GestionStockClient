import { ActivatedRoute } from '@angular/router';
import { CategorieE } from '../exchange/e_categorie';
import { ClientE } from '../exchange/e_client';
import { ClientService } from './../shared/services/client.service';
import { CommandeClientService } from './../shared/services/commande_client.service';
import { CommandeTable, CommandeClientAddingRequest } from '../exchange/e_commande_client';
import { Component, OnInit } from '@angular/core';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LigneCmdClientE } from './../exchange/e_ligne_cmd_client';
import { MagasinE } from './../exchange/e_magasin';
import { ModeReglementEnum } from 'app/exchange/mode_reglement_enum';
import { ProduitE } from '../exchange/e_produit';
import { ReglementClientE } from '../exchange/e_reglement_client';
import { TokenStorageService } from 'app/auth/token.storage.service';


@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})

export class CommandeComponent implements OnInit {

  currentDateTime = Date.now(); // La date d'aujourd'hui
  magasin = new MagasinE(); // le magasin lié à l'USER de l'app

  // Client
  clients: ClientE[] = [];
  indiceClientSelectionne = 0; // selectionnement de client

  fraisLivraison = false; // boolean indiquant que les frais de livraison sont incluses (pour ajouter ces frais aux chargues)

  // categorie
  public categories: CategorieE[] = []; // tableau des categories de la liste déroulante (pour faciliter le choix des produits)
  indiceCategorieSelectionne = 0; // selectionnement de la catégorie des produits

  // produits
  produits: ProduitE[] = [];  // tableau des produits de la liste déroulante qui va se varirer pour l'affichage des produits selon la catégorie sélectionnée
  indiceProduitSelectionne = 0;  // slectionnement du produit

  // commnade
  public commandeTable: CommandeTable[] = []; // le tableau général des produits choisis pour la commande courantes (prod, prix, quantité et somme)

  prixLigneCommande = 0; // prix du produit sélectionné - attribut du formularire de selectionnement de produit
  quantiteLigneCommande = 0; // quantité du produit sélectionné - attribut du formularire de selectionnement de produit
  qts_prods_cat: number[] = [];   // liste contenant les quantites des produits de la categorie sélectionnée

  // paiement
  public reglementTable: ReglementClientE[] = []; // le tableau général des méthodes de paiement/montant de la commande courrante
  modeLigneReglement: ModeReglementEnum = ModeReglementEnum.ESPECES; // mode du paiement (cheque,espece .. ) - attribut du formulaire de paiement
  montantLigneReglement = 0; // montant qui a été payé pour cette méthode - attribut du formulaire de paiement

  montantTotalCmd = 0; // monatant total de la commande actuelle
  montantTotalReglements = 0; // montant total des différentes méthode de paiement (sert pour la validation de la commande et pour l'affichage du mantant réstant à payer dans le formulaire)

  addLigneCmdEnabled = true; // activer le bouton ajouter ligne de commande
  addLigneReglmEnabled = true; // activer le bouton ajouter ligne de reglement
  confirmEnabled = false; // désactiver le bouton confirmer commande

  currentCommandeLigne: number;

  commandeForm: FormGroup;  // le formulaire général de la page (formulaire de la commande)
  paiementForm: FormArray;  // formegroupe de la partie paiement
  clientForm: FormGroup;

  get name() { return this.clientForm.get('name') as FormControl; }

  get rip() { return this.clientForm.get('rip') as FormControl; }

  get phone() { return this.clientForm.get('phone') as FormControl; }

  get email() { return this.clientForm.get('email') as FormControl; }

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private commandeClientService: CommandeClientService,
    private clientService: ClientService,
    private feedBackService: FeedBackService) {
  }

  ngOnInit() {
    this.initMagasin();

    // loading data using resolvers
    this.initClients();
    this.categories = this.route.snapshot.data.categories;
    if (this.categories[this.indiceCategorieSelectionne]) {
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;

      // liste contenant les quantites des produits de la première categorie
      this.qts_prods_cat = this.categories[this.indiceCategorieSelectionne].quantites;
    }

    // init atts
    if (this.produits[this.indiceProduitSelectionne]) {
      this.prixLigneCommande = this.produits[this.indiceProduitSelectionne].prixUnitaire;
    }

    this.quantiteLigneCommande = this.getProductQuantity(this.indiceProduitSelectionne);

    this.createForm();
    this.createClientForm();
  }

  createForm() {
    this.commandeForm = this.formBuilder.group({
      client: 0,
      livraison: false,
      categorie: 0,
      produit: 0,
      modeReglement: 'ESPECES',
      // prixProduit: this.prixLigneCommande,
      // quantitProduit: this.quantiteLigneCommande,
      // paiementForm: this.formBuilder.array([this.createPaiementFormItem()])
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

  resetCommandeForm() {
    this.commandeForm.controls.client.setValue(0);
    this.commandeForm.controls.livraison.setValue(false);
    this.commandeForm.controls.categorie.setValue(0);

    this.produits = this.categories[0].produits;
    this.prixLigneCommande = this.produits[0].prixUnitaire;
    this.qts_prods_cat = this.categories[0].quantites;

    this.quantiteLigneCommande = this.getProductQuantity(0);

    this.commandeForm.controls.produit.setValue(0);
    this.montantTotalCmd = 0;
    this.montantTotalReglements = 0;
    this.commandeForm.controls.modeReglement.setValue('ESPECES');

    this.commandeTable = [];
    this.reglementTable = [];

    this.addLigneCmdEnabled = true;
    this.addLigneReglmEnabled = true;
    this.confirmEnabled = false;
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

  initMagasin() {
    this.magasin.nom = this.tokenStorageService.getMagasinName();
    this.magasin.idMagasin = this.tokenStorageService.getMagasinId();
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

  //  ajouter une ligne de commande (produit/quantité) au tableau commandeTable
  addCommandeLine() {

    const produitExistant = this.commandeTable.find(ligne => this.produits[this.indiceProduitSelectionne].libelle === ligne.productName);

    if (produitExistant) {
      // if the product is already in the commandeTable we just need to increase the quantity not add a new line
      this.currentCommandeLigne = this.commandeTable.indexOf(produitExistant);
      this.commandeTable[this.currentCommandeLigne].quantite += this.quantiteLigneCommande;
      this.commandeTable[this.currentCommandeLigne].somme += this.prixLigneCommande * this.quantiteLigneCommande;

      this.montantTotalCmd += this.prixLigneCommande * this.quantiteLigneCommande; // calcul du nouveau montant total de la commande
      // ajouter cette somme à la variable montantLigneReglement pour afficher le nouveau montant restant à payer
      this.montantLigneReglement += this.prixLigneCommande * this.quantiteLigneCommande;
    } else {
      const commandeTableTemp = new CommandeTable(
        this.categories[this.indiceCategorieSelectionne].label,
        this.produits[this.indiceProduitSelectionne].libelle,
        this.produits[this.indiceProduitSelectionne].idProduit,
        this.prixLigneCommande,
        this.quantiteLigneCommande,
        this.prixLigneCommande * this.quantiteLigneCommande
      );
      this.commandeTable.push(commandeTableTemp); // ajouter cette ligne de commande au tableau général des commandes

      this.montantTotalCmd = this.montantTotalCmd + commandeTableTemp.somme; // calcul du nouveau montant total de la commande
      // ajouter cette somme à la variable montantLigneReglement pour afficher le nouveau montant restant à payer
      this.montantLigneReglement += commandeTableTemp.somme;
    }

    this.qts_prods_cat[this.indiceProduitSelectionne] -= this.quantiteLigneCommande;
    this.quantiteLigneCommande = this.getProductQuantity(this.indiceProduitSelectionne);
  }

  //  supprimer une ligne de commande
  deleteCommandeLine(index) {

    // retrait de la somme de ligne de commande à partir du montant total de la commande
    this.montantTotalCmd -= this.commandeTable[index].somme;

    // retrait de la somme de ligne de commande à partir du montant de paiement restant
    this.montantLigneReglement -= this.commandeTable[index].somme;

    const categorieExistante = this.categories.find(categorie => categorie.label === this.commandeTable[index].categorieName);
    const produitExistant = categorieExistante.produits.find(produit => produit.idProduit === this.commandeTable[index].productId);
    const indiceProd = categorieExistante.produits.indexOf(produitExistant);

    if (categorieExistante) {
      categorieExistante.quantites[indiceProd] += this.commandeTable[index].quantite;

      if (this.produits[this.indiceProduitSelectionne] === produitExistant) {
        this.quantiteLigneCommande = categorieExistante.quantites[indiceProd];
      }
    }

    this.commandeTable.splice(index, 1); // suppression de ligne de commande à partir du tableau
  }


  //  ajouter une ligne de reglement (paiement) (monatant/méthode) au tableau reglementTable
  addPaymentLine() {

    if (this.montantTotalReglements === this.montantTotalCmd) {
      // teste du total de la commande et le total qui a été payé pour valider la commande
      this.feedBackService.feedBackCustom('إضافة طريقة الدفع', 'لا يمكن إضافة طريقة الدفع ، لأن المبلغ مكتمل', 'error');
      return;
    }

    const reglementTableTemp: ReglementClientE = new ReglementClientE(null, null, this.modeLigneReglement, this.montantLigneReglement);
    this.reglementTable.push(reglementTableTemp);

    this.montantTotalReglements += this.montantLigneReglement;
    this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;

    if (this.montantTotalReglements >= this.montantTotalCmd) {
      this.confirmEnabled = true;
      this.addLigneReglmEnabled = false;
    }
  }

  deletePaymentLine(index: number) {

    this.montantTotalReglements -= this.reglementTable[index].montant;
    this.montantLigneReglement = this.montantTotalCmd - this.montantTotalReglements;
    this.reglementTable.splice(index, 1); // supprimer les données sélectionnées

    if (this.montantTotalCmd > this.montantTotalReglements) {
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

  categorieSelectChange(args) {
    this.indiceCategorieSelectionne = args.target.value;  // indice de la categorie sélectionnée

    if (this.categories[this.indiceCategorieSelectionne]) {
      // remplir le tebleau des produits
      this.produits = this.categories[this.indiceCategorieSelectionne].produits;
      // chargement de la liste des quantités des produits de la catégorie sélectionnée
      this.qts_prods_cat = this.categories[this.indiceCategorieSelectionne].quantites;
    }

    this.indiceProduitSelectionne = 0;  // réinitialiser l'indice de produit sélectionné
    if (this.produits[0]) {
      this.prixLigneCommande = this.produits[0].prixUnitaire;
      this.quantiteLigneCommande = this.getProductQuantity(0);
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
      this.prixLigneCommande = this.produits[this.indiceProduitSelectionne].prixUnitaire;
      this.quantiteLigneCommande = this.getProductQuantity(this.indiceProduitSelectionne);
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

    if (this.modeLigneReglement === ModeReglementEnum.CREDIT) {
      // ajouter le credit au client selectionne en haut
    }
  }

  prixLigneCommandeFocusOut() {
    const profitRatio = 0.4;
    const prixUnitaire = this.produits[this.indiceProduitSelectionne].prixUnitaire;

    if (this.prixLigneCommande > (prixUnitaire * (1 + profitRatio))) {
      this.feedBackService.feedBackCustom('ثمن المنتج', 'نسبة الربح تتجاوز 40 ٪ في المائة', 'warning');
      document.getElementById('prixProduit').className = 'form-control tc-form-control-warning';
    } else if (this.prixLigneCommande < prixUnitaire) {
      this.feedBackService.feedBackCustom('ثمن المنتج', 'ثمن المنتج أقل من السعر الأصلي', 'warning');
      document.getElementById('prixProduit').className = 'form-control tc-form-control-warning';
    } else {
      document.getElementById('prixProduit').className = 'form-control';
    }
  }

  quantiteLigneCommandeFocusOut() {
    let quantiteOrigin = 0;

    if (this.categories[this.indiceCategorieSelectionne]) {
      quantiteOrigin = this.categories[this.indiceCategorieSelectionne].quantites[this.indiceProduitSelectionne];
    }

    if (this.quantiteLigneCommande > quantiteOrigin) {
      this.feedBackService.feedBackCustom('كمية المنتج', 'الكمية المطلوبة تتجاوز الكمية المتاحة في المخزون', 'error');
      document.getElementById('quantitProduit').className = 'form-control tc-form-control-error';
      this.addLigneCmdEnabled = false;
    } else {
      document.getElementById('quantitProduit').className = 'form-control';
      this.addLigneCmdEnabled = true;
    }
  }

  genereFacture() {
    this.confirmEnabled = false;
    const cmd = new CommandeClientAddingRequest();

    cmd.dateCmd = new Date();
    cmd.montantPaye = this.montantTotalCmd;
    cmd.montantTotal = this.montantTotalCmd;
    cmd.livraison = this.fraisLivraison;
    cmd.client = new ClientE();
    cmd.client.idClient = this.clients[this.indiceClientSelectionne].idClient;
    cmd.reglements = [];
    cmd.lignesCmdClient = [];

    // ordonner la table en id croissant
    this.commandeTable.sort((a, b) => (a.productId > b.productId) ? 1 : -1)

    this.commandeTable.forEach(element => {
      const ligne = new LigneCmdClientE(null, element.prix, element.quantite, null,
        new ProduitE(element.productId, null, element.productName));
      cmd.lignesCmdClient.push(ligne);
    });

    this.reglementTable.forEach(element => {
      cmd.reglements.push(element);
    });

    cmd.idMagasin = this.magasin.idMagasin;

    this.commandeClientService.add(cmd).subscribe(
      data => {
        this.feedBackService.feedBackCustom('إضافة طلب', 'تم تمرير هذا الطلب بنجاح', 'success');
        this.resetCommandeForm();
      },
      error => {
        this.feedBackService.feedBackCustom('إضافة طلب', 'تعذر تمرير هذا الطلب', 'error');
      });
  }

  getProductQuantity(index: number): number {
    if (this.qts_prods_cat && this.qts_prods_cat.length !== 0) {
      return this.qts_prods_cat[index];
    }

    return -1;
  }
}
