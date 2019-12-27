import { AccessDeniedComponent } from './../../components/access-denied/access-denied.component';
import { StatFournisseurCountResolver, StatOuvrierCountResolver, StatIncomesResolver, StatOutcomesResolver, StatChargesOutcomesResolver } from './../../shared/resolvers/statistiques.resolver';
import { CommandeFournisseurService } from './../../shared/services/commande_fournisseur.service';
import { DataTablesModule } from 'angular-datatables';
import { ChargeResolver } from './../../shared/resolvers/charge.resolver';
import { ChargeService } from './../../shared/services/charge.service';
import { FournisseurResolver } from './../../shared/resolvers/fournisseur.resolver';
import { FournisseurService } from './../../shared/services/fournisseur.service';
import { ClientResolver } from './../../shared/resolvers/client.resolver';
import { ClientService } from './../../shared/services/client.service';
import { MagasinResolver } from './../../shared/resolvers/magasin.resolver';
import { MagasinService } from './../../shared/services/magasin.service';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FournisseurComponent } from '../../fournisseur/fournisseur.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AddprodComponent } from '../../addprod/addprod.component';
import { ChargeComponent } from '../../charge/charge.component';
import { EmployeComponent } from '../../employe/employe.component';
import { StatistiqueComponent } from '../../statistique/statistique.component';

import { ClientComponent } from 'app/client/client.component';
import { CommandeComponent } from 'app/commande/commande.component';
import { StockComponent } from 'app/stock/stock.component';
import { AppUserComponent } from './../../app-users/app-users.component';
import { LoginComponent } from 'app/login/login.component';

import { AppUserService } from 'app/shared/services/app-user.service';
import { AppUserResolver } from 'app/shared/resolvers/app-users.resolver';
import { HomeComponent } from 'app/home/home.component';
import { CategorieService } from 'app/shared/services/categorie.service';
import { CategorieRosolver, CategorieRosolverForClientCommandes } from 'app/shared/resolvers/categorie.resolver';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatRadioModule
} from '@angular/material';
import { MouvementStockService } from 'app/shared/services/mouvement_stock.service';
import { OuvrierService } from 'app/shared/services/ouvrier.service';
import { OuvrierResolver } from 'app/shared/resolvers/ouvrier.resolver';
import { TypeChargeResolver } from 'app/shared/resolvers/typeCharge.resolver';
import { DateFormat } from 'app/config/dateFormat';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ProduitService } from 'app/shared/services/produit.service';
import { MouvementStockResolver } from 'app/shared/resolvers/mouvement_stock.resolver';
import { CommandeClientService } from 'app/shared/services/commande_client.service';
import { FeedBackService } from 'app/config/feed-back.service';
import { StatistiquesService } from 'app/shared/services/statistiques.service';
import { StatClientCountResolver, StatCommandesClientCountResolver } from 'app/shared/resolvers/statistiques.resolver';
import { BillGeneratorService } from 'app/config/BillGenerator.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,

    DataTablesModule
  ],
  declarations: [
    DashboardComponent,
    CommandeComponent,
    ClientComponent,
    StockComponent,
    FournisseurComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    AddprodComponent,
    ChargeComponent,
    EmployeComponent,
    StatistiqueComponent,
    AppUserComponent,
    LoginComponent,
    HomeComponent,
    AccessDeniedComponent
  ],
  providers: [
    AppUserService, AppUserResolver,
    CategorieService, CategorieRosolver, CategorieRosolverForClientCommandes,
    ChargeService, ChargeResolver,
    ClientService, ClientResolver,
    CommandeClientService,
    CommandeFournisseurService,
    FournisseurService, FournisseurResolver,
    MagasinService, MagasinResolver,
    MouvementStockService, MouvementStockResolver,
    OuvrierService, OuvrierResolver,
    ProduitService,
    StatistiquesService, StatClientCountResolver, StatFournisseurCountResolver, StatOuvrierCountResolver,
    StatCommandesClientCountResolver, StatIncomesResolver, StatOutcomesResolver, StatChargesOutcomesResolver,
    TypeChargeResolver,

    FeedBackService,
    BillGeneratorService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }
  ]
})

export class AdminLayoutModule { }
