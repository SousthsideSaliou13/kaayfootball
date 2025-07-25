
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-entreprise',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-entreprise.component.html',
  styleUrls: ['./edit-entreprise.component.scss']
})
export class EditEntrepriseComponent {
  reactiveForm_edit_entreprise !: FormGroup;
  submitted: boolean = false
  loading_edit_entreprise: boolean = false
  @Input()
  entreprise_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_entreprise_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_entreprise_form()
    this.update_form(this.entreprise_to_edit)
  }
  // mise à jour du formulaire
  update_form(entreprise_to_edit: any) {
    this.reactiveForm_edit_entreprise = this.formBuilder.group({
      nom_entreprise: [entreprise_to_edit.nom_entreprise, Validators.required],
      email: [entreprise_to_edit.email],
      telephone: [entreprise_to_edit.telephone],
      logo: [entreprise_to_edit.logo],
      site_web: [entreprise_to_edit.site_web],
      adresse: [entreprise_to_edit.adresse],
      ninea: [entreprise_to_edit.ninea],
      registre_commerce: [entreprise_to_edit.registre_commerce],
      pays: [entreprise_to_edit.pays],
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_entreprise.controls; }
  // validation du formulaire
  onSubmit_edit_entreprise() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_entreprise.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_entreprise.invalid) {
      return;
    }
    var entreprise = this.reactiveForm_edit_entreprise.value
    this.edit_entreprise({
      condition: ({ id_entreprise: this.entreprise_to_edit.id_entreprise }),
      data: (entreprise)
    })
  }
  // vider le formulaire
  onReset_edit_entreprise() {
    this.submitted = false;
    this.reactiveForm_edit_entreprise.reset();
  }
  edit_entreprise(entreprise: any) {
    this.loading_edit_entreprise = true;
    this.api.taf_post("entreprise/edit", entreprise, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table entreprise. Réponse= ", reponse);
        //this.onReset_edit_entreprise()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table entreprise a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_entreprise = false;
    }, (error: any) => {
      this.loading_edit_entreprise = false;
    })
  }
  get_details_edit_entreprise_form() {
    this.loading_get_details_edit_entreprise_form = true;
    this.api.taf_post("entreprise/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table entreprise. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table entreprise a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_entreprise_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_entreprise_form = false;
    })
  }
}
