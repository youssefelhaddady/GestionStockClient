import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FeedBackService {

  private message: string;
  private title: string;
  private componentName: COMPONENT_NAME;

  constructor(private toastrService: ToastrService) { }

  setComponentName(componentName: COMPONENT_NAME) {
    this.title = '';
    this.message = '';
    this.componentName = componentName;
  }

  showSuccess() {
    this.toastrService.success(this.message, this.title, {
      timeOut: 4000,
      progressBar: true,
      progressAnimation: 'decreasing',
      toastClass: 'ngx-toastr text-right'
    });
  }

  showWarning() {
    this.toastrService.warning(this.message, this.title, {
      timeOut: 4000,
      progressBar: true,
      progressAnimation: 'decreasing',
      toastClass: 'ngx-toastr text-right'
    });
  }

  showError() {
    this.toastrService.error(this.message, this.title, {
      timeOut: 4000,
      progressBar: true,
      progressAnimation: 'decreasing',
      toastClass: 'ngx-toastr text-right'
    });
  }

  feedBackLoadingData(componentName?: COMPONENT_NAME) {
    this.title = 'تحميل معلومات';
    const compName = componentName ? componentName : this.componentName;
    this.message = 'لقد حدث خطأ في تحميل معلومات ' + compName;
    this.showError();
  }

  feedBackInsert(opereationType?: OPERATION_TYPE, componentName?: COMPONENT_NAME) {
    this.title = 'إضافة معلومات';
    const compName = componentName ? componentName : this.componentName;
    if (opereationType === OPERATION_TYPE.FAILURE) {
      this.message = 'تعذر اضافة ' + compName;
      this.showError()
    } else {
      this.message = 'تمت إضافة ' + compName + ' بنجاح';
      this.showSuccess();
    }
  }

  feedBackUpdate(opereationType?: OPERATION_TYPE, componentName?: COMPONENT_NAME) {
    this.title = 'تحديث معلومات';
    const compName = componentName ? componentName : this.componentName;
    if (opereationType === OPERATION_TYPE.FAILURE) {
      this.message = 'تعذر تحديث معلومات ' + compName;
      this.showError();
    } else {
      this.message = 'تم تحديث معلومات ' + compName + ' بنجاح';
      this.showSuccess();
    }
  }

  FeedBackDelete(opereationType?: OPERATION_TYPE, componentName?: COMPONENT_NAME) {
    this.title = 'حذف معلومات';
    const compName = componentName ? componentName : this.componentName;
    if (opereationType === OPERATION_TYPE.FAILURE) {
      this.message = 'تعذر حذف ' + compName;
      this.showError();
    } else {
      this.message = 'تم حذف ' + compName + ' بنجاح';
      this.showSuccess();
    }
  }

  feedBackOperationFailure() {
    this.title = 'اختيار العملية';
    this.message = 'عملية غير معروفة !'
  }

  feedBackCustom(title: string, message: string, feedType: string) {
    this.title = title;
    this.message = message;

    switch (feedType) {
      case 'success':
        this.showSuccess();
        break;
      case 'warning':
        this.showWarning();
        break;
      case 'error':
        this.showError();
        break;
      default:
        this.showWarning();
        break;
    }
  }
}

export enum COMPONENT_NAME {
  APP_USER = 'المستخدم',
  APP_USERS = 'المستخدمين',
  CHARGE = 'التكلفة',
  CHARGES = 'التكاليف',
  CLIENT = 'الزبون',
  CLIENTS = 'الزبائن',
  EMPLOYE = 'العامل',
  EMPLOYES = 'العمال',
  FOURNISSEUR = 'المزود',
  FOURNISSEURS = 'المزودون',
  MAGASIN = 'المخزن',
  MAGASINS = 'المخازن',
}

export enum OPERATION_TYPE {
  SUCCESS,
  FAILURE
}


