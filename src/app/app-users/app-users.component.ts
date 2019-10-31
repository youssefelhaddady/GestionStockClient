import { VerifyAccessPrivilegesService } from './../auth/verify-access-privileges.service';
import { MagasinE } from './../exchange/e_magasin';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppUserService } from 'app/shared/services/app-user.service';
import { AppUserE, AppUserRoleE } from '../exchange/e_app_user';
import { SignUpInfo } from 'app/exchange/model/signup-info';
import { MagasinService } from 'app/shared/services/magasin.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { COMPONENT_NAME, OPERATION_TYPE, FeedBackService } from 'app/config/feed-back.service';
import { DataTableHandler } from 'app/config/dataTableHandler';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.css']
})
export class AppUserComponent extends DataTableHandler implements OnInit, AfterViewInit, OnDestroy {

  currentDateTime = Date.now();
  appUsers: AppUserE[] = [];

  appUserForm: FormGroup;
  magasinForm: FormGroup;

  operation = 'add';
  appUserSelectionne: AppUserE;

  constructor(private formBuilder: FormBuilder,
    private verfyAccessPrivs: VerifyAccessPrivilegesService,
    private appUserService: AppUserService,
    private magasinService: MagasinService,
    private route: ActivatedRoute,
    private feedBackService: FeedBackService) {
    super();
  }

  ngOnInit() {
    this.verfyAccessPrivs.verify();

    this.initAppUser();
    this.initDataTable();
    this.appUsers = this.route.snapshot.data.appUsers;
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.APP_USER);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initAppUser() {
    this.appUserSelectionne = new AppUserE();
    this.appUserSelectionne.magasin = new MagasinE();
    this.createForm();
    this.createMagasinFrom();
  }

  createForm() {
    this.appUserForm = this.formBuilder.group({
      name: [''],
      username: ['', Validators.required],
      roles: ['ROLE_USER'],
      password: [''],
      password_confirmation: [''],
      email: ['', Validators.email],
    });
  }

  createMagasinFrom() {
    this.magasinForm = this.formBuilder.group({
      nom: ['', Validators.required],
      adresse: [''],
      numero_patente: ['0'],
      superficie: ['0'],
    })
  }

  get name() { return this.appUserForm.get('name') as FormControl; }

  get username() { return this.appUserForm.get('username') as FormControl; }

  get password() { return this.appUserForm.get('password') as FormControl; }

  get password_confirmation() { return this.appUserForm.get('password_confirmation') as FormControl; }

  get email() { return this.appUserForm.get('email') as FormControl; }

  get roles() { return this.appUserForm.get('roles') as FormControl; }

  get nom() { return this.magasinForm.get('nom') as FormControl; }

  isMached(): boolean {
    const pass = this.password.value;
    const confirmPass = this.password_confirmation.value;

    return pass === confirmPass;
  }

  setPasswordValidators() {
    this.appUserForm.get('password').setValidators([Validators.required]);
    this.appUserForm.get('password_confirmation').setValidators([Validators.required]);
    this.appUserForm.get('password').updateValueAndValidity();
    this.appUserForm.get('password_confirmation').updateValueAndValidity();
  }

  clearePasswordValidators() {
    this.appUserForm.get('password').clearValidators();
    this.appUserForm.get('password_confirmation').clearValidators();
    this.appUserForm.get('password').updateValueAndValidity();
    this.appUserForm.get('password_confirmation').updateValueAndValidity();
  }

  loadAppUsers() {
    this.appUserService.getAll().subscribe(
      data => {
        this.appUsers = data;
        this.rerender();
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.APP_USERS);
      }
    )
  }

  addAppUser() {
    const appUserTemp = this.appUserForm.value;
    const magasinTemp = this.magasinForm.value;

    const magasin = new MagasinE(0, magasinTemp.nom, magasinTemp.adresse, magasinTemp.numero_patente, magasinTemp.superficie, null);

    const user = new AppUserE(0, appUserTemp.name, appUserTemp.username,
      appUserTemp.password, appUserTemp.email,
      [new AppUserRoleE(0, appUserTemp.roles)], magasin
    );

    this.appUserService.add(user).subscribe(
      res => {
        this.loadAppUsers();
        this.feedBackService.feedBackInsert();
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE);
      }
    );
  }

  updateAppUser() {
    const appUserTemp = this.appUserForm.value;
    const magasinTemp = this.magasinForm.value;

    const magasin = new MagasinE(this.appUserSelectionne.magasin.idMagasin, magasinTemp.nom, magasinTemp.adresse,
      magasinTemp.numero_patente, magasinTemp.superficie, new AppUserE(this.appUserSelectionne.idUser)
    );

    const user = new AppUserE(this.appUserSelectionne.idUser, appUserTemp.name, appUserTemp.username,
      appUserTemp.password, appUserTemp.email,
      [new AppUserRoleE(0, appUserTemp.roles)], null
    );

    this.appUserService.update(user).subscribe(
      res => {
        this.loadAppUsers();
        this.feedBackService.feedBackUpdate();
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE);
      }
    );

    this.magasinService.update(magasin).subscribe(
      res => {
        this.loadAppUsers();
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.SUCCESS, COMPONENT_NAME.MAGASIN);
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE, COMPONENT_NAME.MAGASIN);
      }
    );
  }

  deleteAppUser() {
    this.appUserService.delete(this.appUserSelectionne.idUser).subscribe(
      res => {
        this.loadAppUsers();
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
}
