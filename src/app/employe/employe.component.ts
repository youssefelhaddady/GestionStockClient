import { VerifyAccessPrivilegesService } from './../auth/verify-access-privileges.service';
import { AbsenceE, OuvrierE } from './../exchange/e_ouvrier';
import { OuvrierService } from 'app/shared/services/ouvrier.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';
import { DataTableHandler } from 'app/config/dataTableHandler';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.css']
})
export class EmployeComponent extends DataTableHandler implements OnInit {

  currentDateTime = Date.now();
  ouvriers: OuvrierE[] = [];

  ouvrierForm: FormGroup;

  operation = 'add';
  ouvrierSelectione: OuvrierE;

  // absenceForm: FormGroup;

  montantDonne = 0; // donner un avance à l'ouvrier

  constructor(private formBuilder: FormBuilder,
    private ouvrierService: OuvrierService,
    private route: ActivatedRoute,
    private verifyAccessPrivs: VerifyAccessPrivilegesService,
    private feedBackService: FeedBackService) {
      super();
  }

  ngOnInit() {
    this.verifyAccessPrivs.verify();

    this.initDataTable();
    this.initOuvrier();
    this.ouvriers = this.route.snapshot.data.ouvriers;
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.EMPLOYE);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initOuvrier() {
    this.ouvrierSelectione = new OuvrierE();
    this.createForms();
  }

  createForms() {
    this.ouvrierForm = this.formBuilder.group({
      cin: '',
      name: ['', Validators.required],
      rip: ['', Validators.min(0)],
      salaire: ['', Validators.compose([Validators.required, Validators.min(0)])],
      phone: ['', Validators.minLength(10)],
      address: '',
      email: ['', Validators.email],
    });

    /*this.absenceForm = this.formBuilder.group({
      nbAbsence: ['1', Validators.compose([Validators.required, Validators.min(1), Validators.max(31)])]
    });*/

    /*this.avanceForm = this.formBuilder.group({
      : ['1', Validators.compose([Validators.required, Validators.min(1), Validators.max(31)])]
    });*/
  }

  get name() { return this.ouvrierForm.get('name') as FormControl; }

  get rip() { return this.ouvrierForm.get('rip') as FormControl; }

  get salaire() { return this.ouvrierForm.get('salaire') as FormControl; }

  get phone() { return this.ouvrierForm.get('phone') as FormControl; }

  get email() { return this.ouvrierForm.get('email') as FormControl; }

  // get nbAbsence() { return this.absenceForm.get('nbAbsence') as FormControl; }

  loadOuvriers() {
    this.ouvrierService.getAll().subscribe(
      data => {
        this.ouvriers = data;
        this.rerender();
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.EMPLOYES);
      }
    );
  }

  addOuvrier() {
    const ouvrierTemp = this.ouvrierForm.value;

    const ouvrier = new OuvrierE(
      0, ouvrierTemp.cin, ouvrierTemp.name,
      ouvrierTemp.rip, ouvrierTemp.phone, ouvrierTemp.address,
      ouvrierTemp.email, ouvrierTemp.salaire, 0, null);

    this.ouvrierService.add(ouvrier).subscribe(
      res => {
        this.loadOuvriers();
        this.feedBackService.feedBackInsert();
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE);
      }
    );
  }

  updateOuvrier() {
    const ouvrierTemp = this.ouvrierForm.value;

    const ouvrier = new OuvrierE(
      this.ouvrierSelectione.idOuvrier, ouvrierTemp.cin, ouvrierTemp.name,
      ouvrierTemp.rip, ouvrierTemp.phone, ouvrierTemp.address,
      ouvrierTemp.email, ouvrierTemp.salaire, this.ouvrierSelectione.avance,
      this.ouvrierSelectione.absences);

    this.ouvrierService.update(ouvrier).subscribe(
      res => {
        this.loadOuvriers();
        this.feedBackService.feedBackUpdate();
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE);
      }
    );
  }

  deleteOuvrier() {
    this.ouvrierService.delete(this.ouvrierSelectione.idOuvrier).subscribe(
      res => {
        this.loadOuvriers();
        this.feedBackService.FeedBackDelete();
      },
      error => {
        this.feedBackService.FeedBackDelete(OPERATION_TYPE.FAILURE);
      }
    );
  }

  signOuvrierAbsence() {

    const absence = new AbsenceE(0, new Date(), this.ouvrierSelectione);

    this.ouvrierService.signAbsence(absence).subscribe(
      res => {
        this.loadOuvriers();
        this.feedBackService.feedBackCustom('غياب العامل', 'تم توقيع العامل غائبًا', 'success');
      },
      error => {
        this.feedBackService.feedBackCustom('غياب العامل', 'تعذر انجاز العملية', 'error');
      }
    );
  }

  giveAvance() {
    const ouvrier = new OuvrierE();

    ouvrier.idOuvrier = this.ouvrierSelectione.idOuvrier;
    ouvrier.avance = this.montantDonne;

    this.ouvrierService.giveAmount(ouvrier).subscribe(
      res => {
        this.loadOuvriers();
        this.feedBackService.feedBackCustom('منحة العامل', 'أعطيت للعامل مبلغ من المال', 'success');
      },
      error => {
        this.feedBackService.feedBackCustom('منحة العامل', 'تعذر انجاز العملية', 'error');
      }
    );

    this.montantDonne = 0;
  }

  operationError() {
    this.feedBackService.feedBackOperationFailure();
  }
}
