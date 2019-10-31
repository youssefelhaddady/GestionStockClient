import { VerifyAccessPrivilegesService } from './../auth/verify-access-privileges.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ChargeService } from 'app/shared/services/charge.service';
import { AppUserE } from '../exchange/e_app_user';
import { ChargeE } from './../exchange/e_charge';
import { TypeChargeE } from './../exchange/e_type_charge';
import { TokenStorageService } from './../auth/token.storage.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTableHandler } from 'app/config/dataTableHandler';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.css']
})
export class ChargeComponent extends DataTableHandler implements OnInit {

  currentDateTime = Date.now();
  chargesFitched: ChargeE[] = [];
  charges: ChargeE[] = [];
  typesCharge: TypeChargeE[] = [];

  chargeForm: FormGroup;
  typeChargeForm: FormGroup;

  operation = 'add';
  chargeSelectionne: ChargeE;
  typeDeChargeSelectionne: TypeChargeE;

  selectedMonth = new Date();
  hasDataForPreviousMonth = false;
  hasDataForNextMonth = false;

  date = new Date();
  // firstDayOnCurrentMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  // lastDayOnCurrentMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  constructor(private formBuilder: FormBuilder,
    private chargeService: ChargeService,
    private route: ActivatedRoute,
    private tokenService: TokenStorageService,
    private verifyAccessPrivis: VerifyAccessPrivilegesService,
    private feedBackService: FeedBackService) {
    super();
  }

  ngOnInit() {
    this.verifyAccessPrivis.verify();

    this.initDataTable();
    this.initCharge();
    // data.series = data.series.filter((item: any) =>
    //   item.date.getTime() >= fromDate.getTime() && item.date.getTime() <= toDate.getTime()
    // );
    this.chargesFitched = this.route.snapshot.data.charges;
    this.currentMonth();
    this.typesCharge = this.route.snapshot.data.typesCharge;
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.CHARGE);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initDataTable() {
    this.dtOptions = {
      paging: false,
      info: false,
      destroy: true,
      searching: false,
      processing: true,
      language: {
        processing: 'جارٍ التحميل...',
        zeroRecords: 'لم يُعثَر على أيةِ سجلات',
        infoPostFix: '',
        search: 'ابحث:',
        url: '',
        paginate: {
          first: 'الأول',
          previous: 'السابق',
          next: 'التالي',
          last: 'الأخير'
        },
        thousands: '.'
      },
      deferRender: true,
      responsive: false,
    };
  }

  initCharge() {
    this.chargeSelectionne = new ChargeE();
    this.typeDeChargeSelectionne = new TypeChargeE();
    this.createForms();
  }

  createForms() {
    this.chargeForm = this.formBuilder.group({
      typeDeCharge: ['', Validators.required],
      dateCharge: ['', Validators.required],
      montant: ['', Validators.compose([Validators.required, Validators.min(0)])],
      etat: 'NONPAYE',
    });

    this.typeChargeForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  get typeDeCharge() { return this.chargeForm.get('typeDeCharge') as FormControl; }
  get dateCharge() { return this.chargeForm.get('dateCharge') as FormControl; }
  get montant() { return this.chargeForm.get('montant') as FormControl; }
  get name() { return this.typeChargeForm.get('name') as FormControl; }

  loadCharges() {
    this.chargeService.getAll().subscribe(
      data => {
        this.chargesFitched = data;
        this.currentMonth();
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.CHARGES);
      }
    )
  }

  loadTypesCharge() {
    this.chargeService.getAllChargeTypes().subscribe(
      data => {
        this.typesCharge = data;
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.CHARGES);
      }
    )
  }

  addCharge() {
    const chargeTemp = this.chargeForm.value;
    chargeTemp.typeDeCharge = this.typeDeChargeSelectionne;
    chargeTemp.user = new AppUserE();
    chargeTemp.user.username = this.tokenService.getUsername();

    this.chargeService.add(chargeTemp).subscribe(
      res => {
        this.loadCharges();
        this.feedBackService.feedBackInsert();
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE);
      }
    );
  }

  updateCharge() {
    const chargeTemp = this.chargeForm.value;
    chargeTemp.idCharge = this.chargeSelectionne.idCharge;
    chargeTemp.typeDeCharge = this.typeDeChargeSelectionne;
    chargeTemp.user = new AppUserE();
    chargeTemp.user.username = this.tokenService.getUsername();

    this.chargeService.update(chargeTemp).subscribe(
      res => {
        this.loadCharges();
        this.feedBackService.feedBackUpdate();
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE);
      }
    );
  }

  deleteCharge() {
    this.chargeService.delete(this.chargeSelectionne.idCharge).subscribe(
      res => {
        this.loadCharges();
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

  newTypeCharge() {
    document.getElementById('openModalButton').click();
  }

  addTypeCharge() {
    const typeDeCharge = new TypeChargeE(0, this.typeChargeForm.value.name);

    this.chargeService.addChargeType(typeDeCharge).subscribe(
      res => {
        this.loadTypesCharge();
        this.feedBackService.feedBackCustom('إضافة معلومات', ' إضافة اسم التكلفة بنجاح', 'success');
        const elem = this.typesCharge.length - 1;
        this.typeDeChargeSelectionne = this.typesCharge[elem];
      },
      error => {
        this.feedBackService.feedBackCustom('إضافة معلومات', 'تعذر اضافة اسم التكلفة', 'error');
      }
    );
  }

  getEtatCharge(etat: string): string {
    switch (etat) {
      case 'PAYE':
        return 'مدفوعة';
      case 'NONPAYE':
        return 'غير مدفوعة';

      default:
        return 'غير مدفوعة';
    }
  }


  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  getMonthCharges(month: Date): ChargeE[] {

    return this.chargesFitched.filter(charg => {
      if (new Date(charg.dateCharge) >= this.getFirstDayOfMonth(month)
        && new Date(charg.dateCharge) <= this.getLastDayOfMonth(month)) {

        return charg;
      }
    });
  }

  setSelectedMonthCharges() {
    this.charges = [];
    this.charges = this.getMonthCharges(this.selectedMonth);
    this.checkPreviousAndNextData();
  }

  currentMonth() {
    this.selectedMonth = new Date();

    this.setSelectedMonthCharges();
  }

  previousMonth() {
    this.selectedMonth.setMonth(this.selectedMonth.getMonth() - 1);

    this.setSelectedMonthCharges();
  }

  nextMonth() {
    this.selectedMonth.setMonth(this.selectedMonth.getMonth() + 1);

    this.setSelectedMonthCharges();
  }

  checkPreviousAndNextData() {
    const previousMonth = new Date(this.selectedMonth);
    previousMonth.setMonth(this.selectedMonth.getMonth() - 1);
    const previousMonthData = this.getMonthCharges(previousMonth);
    this.hasDataForPreviousMonth = previousMonthData.length > 0;

    const nextMonth = new Date(this.selectedMonth);
    nextMonth.setMonth(this.selectedMonth.getMonth() + 1);
    const nextMonthData = this.getMonthCharges(nextMonth);
    this.hasDataForNextMonth = nextMonthData.length > 0;
  }
}
