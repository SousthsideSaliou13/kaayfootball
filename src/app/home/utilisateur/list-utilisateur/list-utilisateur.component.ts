import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddUtilisateurComponent } from '../add-utilisateur/add-utilisateur.component';
import { EditUtilisateurComponent } from '../edit-utilisateur/edit-utilisateur.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { SearchServiceService } from '../../../service/searchService/search-service.service';
@Component({
  selector: 'app-list-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, FormsModule, RouterModule], // Dépendances importées
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.scss']
})
export class ListUtilisateurComponent {
  loading_get_utilisateur = false
  les_utilisateurs: any[] = []
  selected_utilisateur: any = undefined
  utilisateur_to_edit: any = undefined
  loading_delete_utilisateur = false
  constructor(public api: ApiService, private modalService: NgbModal, public searchService: SearchServiceService) {

  }
  ngOnInit(): void {
    this.get_utilisateur()
  }
  get_utilisateur() {
    let paarms = {
      id_entreprise: this.api.current_entreprise.id_entreprise,
    }
    this.loading_get_utilisateur = true;
    this.api.taf_post("utilisateur/get", paarms, (reponse: any) => {
      if (reponse.status) {
        this.les_utilisateurs = reponse.data
        this.searchService.data = this.les_utilisateurs
        this.searchService.filter_change()
        console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_utilisateur = false;
    }, (error: any) => {
      this.loading_get_utilisateur = false;

    })
  }


  voir_plus(one_utilisateur: any) {
    this.selected_utilisateur = one_utilisateur
  }
  on_click_edit(one_utilisateur: any) {
    this.utilisateur_to_edit = one_utilisateur
  }
  on_close_modal_edit() {
    this.utilisateur_to_edit = undefined
  }
  delete_utilisateur(utilisateur: any) {
    let etat: any
    if (utilisateur.statut == "Actif") {
      etat = "Inactif"
    } else {
      etat = "Actif"

    }
    this.loading_delete_utilisateur = true;
    this.api.taf_post("utilisateur/edit3", { condition: { id_utilisateur: utilisateur.id_utilisateur }, data: { statut: etat } }, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table utilisateur . Réponse = ", reponse)
        this.get_utilisateur()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table utilisateur  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_utilisateur = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_utilisateur = false;
      })
  }
  openModal_add_utilisateur() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddUtilisateurComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_utilisateur()
      } else {

      }
    })
  }
  openModal_edit_utilisateur(one_utilisateur: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditUtilisateurComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.utilisateur_to_edit = one_utilisateur;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_utilisateur()
      } else {

      }
    })
  }
}
