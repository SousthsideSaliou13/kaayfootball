import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAbonnementComponent } from './abonnement/list-abonnement/list-abonnement.component';
import { ListEntrepriseComponent } from './entreprise/list-entreprise/list-entreprise.component';
import { ListLogComponent } from './log/list-log/list-log.component';
import { ListPrivilegeComponent } from './privilege/list-privilege/list-privilege.component';
import { ListReservationComponent } from './reservation/list-reservation/list-reservation.component';
import { ListTerrainComponent } from './terrain/list-terrain/list-terrain.component';
import { ListTypeAbonnementComponent } from './type-abonnement/list-type-abonnement/list-type-abonnement.component';
import { ListTypeReservationComponent } from './type-reservation/list-type-reservation/list-type-reservation.component';
import { ListUtilisateurComponent } from './utilisateur/list-utilisateur/list-utilisateur.component';
import { ListUtilisateurEntrepriseComponent } from './utilisateur-entreprise/list-utilisateur-entreprise/list-utilisateur-entreprise.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: "", component: ListReservationComponent },
  { path: "abonnement", component: ListAbonnementComponent },
  { path: "entreprise", component: ListEntrepriseComponent },
  { path: "log", component: ListLogComponent },
  { path: "privilege", component: ListPrivilegeComponent },
  { path: "reservation", component: ListReservationComponent },
  { path: "terrain", component: ListTerrainComponent },
  { path: "type_abonnement", component: ListTypeAbonnementComponent },
  { path: "type_reservation", component: ListTypeReservationComponent },
  { path: "utilisateur", component: ListUtilisateurComponent },
  { path: "profil", component: ProfilComponent },
  { path: "utilisateur_entreprise", component: ListUtilisateurEntrepriseComponent },
  { path: "", pathMatch: "full", redirectTo: "reservation" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
