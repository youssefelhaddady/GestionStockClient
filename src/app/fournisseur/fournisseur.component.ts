import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FournisseurService } from 'app/shared/services/fournisseur.service';
import { FournisseurE } from '../exchange/e_fournisseur';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTableHandler } from 'app/config/dataTableHandler';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent extends DataTableHandler implements OnInit, AfterViewInit, OnDestroy {

  currentDateTime = Date.now();
  fournisseurs: FournisseurE[] = [];

  fournisseurForm: FormGroup;

  operation = 'add';
  fournisseurSelectionne: FournisseurE;

  constructor(private formBuilder: FormBuilder,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private feedBackService: FeedBackService) {
    super();
  }

  ngOnInit() {
    this.initFournisseur();
    this.initDataTable();
    this.fournisseurs = this.route.snapshot.data.fournisseurs;
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.FOURNISSEUR);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initFournisseur() {
    this.fournisseurSelectionne = new FournisseurE();
    this.fournisseurSelectionne.credit = 0;
    this.createForms();
  }

  createForms() {
    this.fournisseurForm = this.formBuilder.group({
      cin: '',
      name: ['', Validators.required],
      raison_sociale: '',
      creditFournisseur: ['0', Validators.min(0)],
      pretFournisseur: ['0', Validators.min(0)],
      rip: ['', Validators.min(0)],
      phone: ['', Validators.minLength(10)],
      address: '',
      email: ['', Validators.email],
    });
  }

  get name() { return this.fournisseurForm.get('name') as FormControl; }

  get creditFournisseur() { return this.fournisseurForm.get('creditFournisseur') as FormControl; }

  get pretFournisseur() { return this.fournisseurForm.get('pretFournisseur') as FormControl; }

  get rip() { return this.fournisseurForm.get('rip') as FormControl; }

  get phone() { return this.fournisseurForm.get('phone') as FormControl; }

  get email() { return this.fournisseurForm.get('email') as FormControl; }

  loadFournisseurs() {
    this.fournisseurService.getAll().subscribe(
      data => {
        this.fournisseurs = data
        this.rerender();
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.FOURNISSEURS);
      }
    );
  }

  addFournisseur() {
    const fournisseurForm = this.fournisseurForm.value;
    const fournisseurTemp = new FournisseurE(0, fournisseurForm.raison_sociale, 0,
      fournisseurForm.cin, fournisseurForm.name, fournisseurForm.rip, fournisseurForm.phone,
      fournisseurForm.address, fournisseurForm.email, null
    );
    fournisseurTemp.credit += fournisseurForm.creditFournisseur;
    fournisseurTemp.credit -= fournisseurForm.pretFournisseur;

    this.fournisseurService.add(fournisseurTemp).subscribe(
      res => {
        this.loadFournisseurs();
        this.feedBackService.feedBackInsert();
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE);
      }
    );
  }

  updateFournisseur() {

    const fournisseurForm = this.fournisseurForm.value;
    const fournisseurTemp = new FournisseurE(this.fournisseurSelectionne.idFournisseur, fournisseurForm.raison_sociale, 0,
      fournisseurForm.cin, fournisseurForm.name, fournisseurForm.rip, fournisseurForm.phone,
      fournisseurForm.address, fournisseurForm.email, null
    );
    fournisseurTemp.credit += fournisseurForm.creditFournisseur;
    fournisseurTemp.credit -= fournisseurForm.pretFournisseur;

    this.fournisseurService.update(fournisseurTemp).subscribe(
      res => {
        this.loadFournisseurs();
        this.feedBackService.feedBackUpdate();
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE);
      }
    );
  }

  deleteFournisseur() {
    this.fournisseurService.delete(this.fournisseurSelectionne.idFournisseur).subscribe(
      res => {
        this.loadFournisseurs();
        this.feedBackService.FeedBackDelete();
      },
      error => {
        this.feedBackService.FeedBackDelete(OPERATION_TYPE.FAILURE);
      }
    );
  }

  operationError() {
    this.feedBackService.feedBackOperationFailure();
  }

  public getCreditFournisseur(credit: number): number {
    return (credit <= 0) ? 0 : Math.abs(credit);
  }

  public getPretFournisseur(credit: number): number {
    return (credit >= 0) ? 0 : Math.abs(credit);
  }
}
