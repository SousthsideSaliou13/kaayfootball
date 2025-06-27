
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-add-reservation',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddReservationComponent {
  reactiveForm_add_reservation !: FormGroup;
  submitted: boolean = false
  loading_add_reservation: boolean = false
  form_details: any = {}
  loading_get_details_add_reservation_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.get_details_add_reservation_form()
    this.init_form()
  }
  init_form() {
    this.reactiveForm_add_reservation = this.formBuilder.group({
      // id_entreprise: [""],
      // id_utilisateur: [""],
      id_terrain: ["", Validators.required],
      id_type_reservation: [""],
      libelle_reservation: [""],
      date: ["", Validators.required],
      heure_debut: ["", Validators.required],
      heure_fin: ["", Validators.required],
      evaluation: [""],
      // etat: ["", Validators.required],
      // updated_at: ["", Validators.required],
      statut: [""]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_reservation.controls; }
  // validation du formulaire
  onSubmit_add_reservation() {
    this.submitted = true;
    console.log(this.reactiveForm_add_reservation.value)
    // stop here if form is invalid
    if (this.reactiveForm_add_reservation.invalid) {
      return;
    }
    var reservation = this.reactiveForm_add_reservation.value
    reservation.id_entreprise = this.api.current_entreprise.id_entreprise;
    reservation.id_utilisateur = this.api.current_entreprise.id_utilisateur;
    this.add_reservation(reservation)
  }
  // vider le formulaire
  onReset_add_reservation() {
    this.submitted = false;
    this.reactiveForm_add_reservation.reset();
  }
  add_reservation(reservation: any) {
    this.loading_add_reservation = true;
    this.api.taf_post("reservation/add", reservation, (reponse: any) => {
      this.loading_add_reservation = false;
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table reservation. Réponse= ", reponse);
        this.onReset_add_reservation()
        this.api.Swal_success("Opération éffectuée avec succés")
        this.activeModal.close(reponse)
      } else {
        console.log("L'opération sur la table reservation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
      this.loading_add_reservation = false;
    })
  }

  get_details_add_reservation_form() {
    this.loading_get_details_add_reservation_form = true;
    this.api.taf_post("reservation/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table reservation. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table reservation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_reservation_form = false;
    }, (error: any) => {
      this.loading_get_details_add_reservation_form = false;
    })
  }
}
