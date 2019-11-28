import { AccessDeniedComponent } from './../../components/access-denied/access-denied.component';
import { StatFournisseurCountResolver, StatOuvrierCountResolver } from './../../shared/resolvers/statistiques.resolver';

import { OuvrierResolver } from './../../shared/resolvers/ouvrier.resolver';
import { ClientResolver } from './../../shared/resolvers/client.resolver';
import { HomeComponent } from './../../home/home.component';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommandeComponent } from '../../commande/commande.component';
import { ClientComponent } from '../../client/client.component';
import { FournisseurComponent } from '../../fournisseur/fournisseur.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AddprodComponent } from '../../addprod/addprod.component';
import { ChargeComponent } from '../../charge/charge.component';
import { EmployeComponent } from '../../employe/employe.component';
import { StatistiqueComponent } from '../../statistique/statistique.component';
import { CategorieRosolver, CategorieRosolverForClientCommandes } from 'app/shared/resolvers/categorie.resolver';
import { StockComponent } from 'app/stock/stock.component';
import { AppUserComponent } from 'app/app-users/app-users.component';
import { AppUserResolver } from 'app/shared/resolvers/app-users.resolver';
import { LoginComponent } from 'app/login/login.component';
import { FournisseurResolver } from 'app/shared/resolvers/fournisseur.resolver';
import { ChargeResolver } from 'app/shared/resolvers/charge.resolver';
import { TypeChargeResolver } from 'app/shared/resolvers/typeCharge.resolver';
import { MouvementStockResolver } from 'app/shared/resolvers/mouvement_stock.resolver';
import { StatClientCountResolver, StatCommandesClientCountResolver } from 'app/shared/resolvers/statistiques.resolver';
import { MagasinResolver } from 'app/shared/resolvers/magasin.resolver';


export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }

    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'commande', component: CommandeComponent, resolve: {
            // magasin : MagasinResolver,
            clients: ClientResolver,
            categories: CategorieRosolverForClientCommandes,
            // qts_prods_first_cat: MouvementStockResolver
        }
    },
    { path: 'client', component: ClientComponent, resolve: { clients: ClientResolver } },
    { path: 'stock', component: StockComponent, resolve: { categories: CategorieRosolver } },
    { path: 'fournisseur', component: FournisseurComponent, resolve: { fournisseurs: FournisseurResolver } },
    { path: 'maps', component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    {
        path: 'addprod', component: AddprodComponent, resolve: {
            magasins : MagasinResolver,
            fournisseurs: FournisseurResolver,
            categories: CategorieRosolver,
            // qts_prods_first_cat: MouvementStockResolver
        }
    },
    { path: 'charge', component: ChargeComponent, resolve: { charges: ChargeResolver, typesCharge: TypeChargeResolver } },
    { path: 'employe', component: EmployeComponent, resolve: { ouvriers: OuvrierResolver } },
    { path: 'statistique', component: StatistiqueComponent, resolve: {
        nombreClients: StatClientCountResolver,
        nombreFournisseurs: StatFournisseurCountResolver,
        nombreOuvriers: StatOuvrierCountResolver,
        nombreCommandesClientParMois: StatCommandesClientCountResolver
    }},
    { path: 'app_users', component: AppUserComponent, resolve: { appUsers: AppUserResolver } },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'access_denied', component: AccessDeniedComponent }
];
