import { VerifyAccessPrivilegesService } from './../auth/verify-access-privileges.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientService } from 'app/shared/services/client.service';
import { ClientE } from '../exchange/e_client';
import { DataTableHandler } from 'app/config/dataTableHandler';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';
import { DELETE_DECISION } from 'app/config/delete_decision.enum';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent extends DataTableHandler implements OnInit, AfterViewInit, OnDestroy {

  currentDateTime = Date.now();
  clients: ClientE[] = [];

  clientForm: FormGroup;

  operation = 'add';
  clientSelectionne: ClientE;

  constructor(private formBuilder: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private verifyAccessPrivs: VerifyAccessPrivilegesService,
    private feedBackService: FeedBackService) {
    super();
  }

  ngOnInit() {
    this.initClient();
    this.initDataTable();
    this.clients = this.route.snapshot.data.clients;
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.CLIENT);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initClient() {
    this.clientSelectionne = new ClientE();
    this.clientSelectionne.credit = 0;
    this.createForms();
  }

  createForms() {
    this.clientForm = this.formBuilder.group({
      cin: '',
      name: ['', Validators.required],
      raison_sociale: '',
      type: 'NORMAL',
      creditClient: ['0', Validators.min(0)],
      pretClient: ['0', Validators.min(0)],
      rip: ['', Validators.min(0)],
      phone: ['', Validators.minLength(10)],
      address: '',
      email: ['', Validators.email],
    });
  }

  get name() { return this.clientForm.get('name') as FormControl; }

  get creditClient() { return this.clientForm.get('creditClient') as FormControl; }

  get pretClient() { return this.clientForm.get('pretClient') as FormControl; }

  get rip() { return this.clientForm.get('rip') as FormControl; }

  get phone() { return this.clientForm.get('phone') as FormControl; }

  get email() { return this.clientForm.get('email') as FormControl; }

  loadClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clients = data;
        this.rerender();
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.CHARGES);
      }
    )
  }

  addClient() {
    const clientForm = this.clientForm.value;
    const clientTemp = new ClientE(0, clientForm.raison_sociale, clientForm.type, 0,
      clientForm.cin, clientForm.name, clientForm.rip, clientForm.phone,
      clientForm.address, clientForm.email, null
    );
    clientTemp.credit += clientForm.creditClient;
    clientTemp.credit -= clientForm.pretClient;

    this.clientService.add(clientTemp).subscribe(
      res => {
        this.loadClients();
        this.feedBackService.feedBackInsert();
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE);
      }
    );
  }

  updateClient() {

    const clientForm = this.clientForm.value;
    const clientTemp = new ClientE(this.clientSelectionne.idClient, clientForm.raison_sociale, clientForm.type, 0,
      clientForm.cin, clientForm.name, clientForm.rip, clientForm.phone,
      clientForm.address, clientForm.email, null
    );
    clientTemp.credit += clientForm.creditClient;
    clientTemp.credit -= clientForm.pretClient;

    this.clientService.update(clientTemp).subscribe(
      res => {
        this.loadClients();
        this.feedBackService.feedBackUpdate();
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE);
      }
    );
  }

  deleteClient() {
    this.clientService.deleteControlled(this.clientSelectionne.idClient, DELETE_DECISION.DELETE).subscribe(
      res => {
        this.loadClients();
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

  getClientType(type: string): string {
    switch (type) {
      case 'NORMAL':
        return 'عادي';

      case 'GROSSISTE':
        return 'تاجر بالجملة';

      case 'SEMI_GROSSISTE':
        return 'تاجر بنصف الجملة';

      default:
        return 'عادي';
    }
  }

  public getCreditClient(credit: number): number {
    return (credit <= 0) ? 0 : Math.abs(credit);
  }

  public getPretClient(credit: number): number {
    return (credit >= 0) ? 0 : Math.abs(credit);
  }

  /*itemDoubleClicked(event) {
    console.log(event);
    alert(event);
  }*/
}
