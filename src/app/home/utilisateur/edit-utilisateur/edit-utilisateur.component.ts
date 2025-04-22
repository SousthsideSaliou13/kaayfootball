
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-utilisateur',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-utilisateur.component.html',
  styleUrls: ['./edit-utilisateur.component.scss']
})
export class EditUtilisateurComponent {
  reactiveForm_edit_utilisateur !: FormGroup;
  submitted: boolean = false
  loading_edit_utilisateur: boolean = false
  @Input()
  utilisateur_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_utilisateur_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_utilisateur_form()
    this.update_form(this.utilisateur_to_edit)
  }
  // mise à jour du formulaire
  update_form(utilisateur_to_edit: any) {
    this.reactiveForm_edit_utilisateur = this.formBuilder.group({
      id_privilege: [utilisateur_to_edit.id_privilege, Validators.required],
      id_entreprise: [utilisateur_to_edit.id_entreprise, Validators.required],
      prenom: [utilisateur_to_edit.prenom, Validators.required],
      nom: [utilisateur_to_edit.nom, Validators.required],
      poste: [utilisateur_to_edit.poste],
      civilite: [utilisateur_to_edit.civilite],
      telephone: [utilisateur_to_edit.telephone],
      login: [utilisateur_to_edit.login, Validators.required],
      password: [utilisateur_to_edit.password]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_utilisateur.controls; }
  // validation du formulaire
  onSubmit_edit_utilisateur() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_utilisateur.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_utilisateur.invalid) {
      return console.log('err');
      ;
    }
    var utilisateur = this.reactiveForm_edit_utilisateur.value
    this.edit_utilisateur({
      condition: ({ id_utilisateur: this.utilisateur_to_edit.id_utilisateur }),
      condition2: ({ id_utilisateur_entreprise: this.utilisateur_to_edit.id_utilisateur_entreprise }),
      data: (utilisateur)
    })
  }
  // vider le formulaire
  onReset_edit_utilisateur() {
    this.submitted = false;
    this.reactiveForm_edit_utilisateur.reset();
  }
  edit_utilisateur(utilisateur: any) {
    this.loading_edit_utilisateur = true;
    this.api.taf_post("utilisateur/edit", utilisateur, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
        //this.onReset_edit_utilisateur()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_utilisateur = false;
    }, (error: any) => {
      this.loading_edit_utilisateur = false;
    })
  }
  get_details_edit_utilisateur_form() {
    this.loading_get_details_edit_utilisateur_form = true;
    this.api.taf_post("utilisateur/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table utilisateur. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table utilisateur a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_utilisateur_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_utilisateur_form = false;
    })
  }
}
