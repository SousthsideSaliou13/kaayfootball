import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api/api.service';
import { SearchServiceService } from '../../service/searchService/search-service.service';
import { md5 } from 'js-md5';
@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  reactiveForm_edit_employe !: FormGroup;
  submitted: boolean = false
  loading_edit_employe: boolean = false
  userConnected: any;
  loading_get_utilisateur = false
  les_utilisateurs: any[] = []
  selected_utilisateur: any = undefined
  utilisateur_to_edit: any = undefined
  loading_delete_utilisateur = false


  ngOnInit(): void {
    this.get_utilisateur()
  }

  constructor(public api: ApiService, private formBuilder: FormBuilder,public searchService:SearchServiceService) { }
  get f(): any { return this.reactiveForm_edit_employe.controls; }
  // mise à jour du formulaire
  update_info_form(employe_to_edit: any) {
    this.reactiveForm_edit_employe = this.formBuilder.group({
      nom: [employe_to_edit.nom],
      prenom: [employe_to_edit.prenom],
      telephone: [employe_to_edit.telephone],
      email: [employe_to_edit.email],
      ancien_pwd: [""],
      nouveau_pwd: [""],
      confirmation_pwd: [""],
    });
  }

  // validation du formulaire
  get_utilisateur() {
    this.loading_get_utilisateur = true;
    this.api.taf_post("utilisateur/get2", {id_utilisateur: this.api.token.user_connected.id_utilisateur}, (reponse: any) => {
      if (reponse.status) {
        this.userConnected = reponse.data
        this.update_info_form(this.userConnected)
        console.log(this.userConnected)
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

  // Validation du formulaire
  onSubmit_edit_employe_info() {
    this.submitted = true;
    const employe = this.reactiveForm_edit_employe.value;
    this.get_utilisateur()
    console.log("employe",employe)
    // Si le formulaire est invalide, arrêtez ici
    if (this.reactiveForm_edit_employe.invalid) {
      return;
    }

    // Extraire les valeurs pertinentes de l'employé
    const { ancien_pwd, confirmation_pwd, nouveau_pwd, ...rest } = employe;

    // Si les champs du mot de passe sont vides, envoyer le formulaire sans validation des mots de passe
    if (ancien_pwd === "" && nouveau_pwd === "" && confirmation_pwd === "") {
      this.edit_employe({
        condition: {id_utilisateur: this.api.token.user_connected.id_utilisateur},
        data: rest,
      });
    } else {
      // Si seulement l'ancien mot de passe est rempli, alerter pour compléter les autres champs
      if (ancien_pwd !== "" && (nouveau_pwd === "" || confirmation_pwd === "")) {
        this.api.Swal_info("Veuillez renseigner le nouveau mot de passe et la confirmation.");
      } else {
        // Si tous les champs sont remplis, procéder à la vérification du mot de passe
        // const md5 = new Md5();
        const password_md5 = md5(ancien_pwd);

        if (password_md5 == this.userConnected.password) {
          // Vérifier si le nouveau mot de passe correspond à la confirmation
          const newPwd = nouveau_pwd
          console.log(newPwd);

          if (nouveau_pwd == confirmation_pwd) {
            console.log(newPwd);
            const newPwdHashed = md5(newPwd);
            // Mettre à jour le mot de passe avec la valeur hashée
            this.reactiveForm_edit_employe.patchValue({
              password: newPwdHashed
            });
            let rest = {
              password : newPwdHashed
            }
            this.edit_employe({
              condition: {id_utilisateur: this.api.token.user_connected.id_utilisateur},
              data: rest,
            });
          } else {
            // Si le nouveau mot de passe et la confirmation ne correspondent pas
            this.api.Swal_info("Le nouveau mot de passe et la confirmation ne correspondent pas.");
          }
        } else {
          // Si l'ancien mot de passe ne correspond pas
          this.api.Swal_info("Veuillez renseigner le bon mot de passe.");
        }
      }
      
    }
  }


  edit_employe(employe: any) {
    this.loading_edit_employe = true;

    this.api.taf_post("utilisateur/profil", employe, (reponse: any) => {
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table employe. Réponse= ", reponse);
        this.onReset_edit_employe()
        this.api.Swal_success("Opération effectuée avec succés");
      } else {
        console.log("L'opération sur la table employe a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_employe = false;
    }, (error: any) => {
      this.loading_edit_employe = false;
    })
  }

  // vider le formulaire
  onReset_edit_employe() {
    this.submitted = false;
    this.reactiveForm_edit_employe.reset();
  }
}

function sha1(ancien_pwd: any) {
  throw new Error('Function not implemented.');
}


