
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-reservation',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule], // Dépendances importées
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss']
})
export class EditReservationComponent {
  reactiveForm_edit_reservation !: FormGroup;
  submitted: boolean = false
  loading_edit_reservation: boolean = false
  @Input()
  reservation_to_edit: any = {}
  form_details: any = {}
  loading_get_details_edit_reservation_form = false
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) {

  }
  ngOnInit(): void {
    this.get_details_edit_reservation_form()
    this.update_form(this.reservation_to_edit)
  }
  // mise à jour du formulaire
  update_form(reservation_to_edit: any) {
    this.reactiveForm_edit_reservation = this.formBuilder.group({
      id_entreprise: [reservation_to_edit.id_entreprise],
      id_utilisateur: [reservation_to_edit.id_utilisateur],
      id_terrain: [reservation_to_edit.id_terrain],
      id_type_reservation: [reservation_to_edit.id_type_reservation],
      libelle_reservation: [reservation_to_edit.libelle_reservation],
      date: [reservation_to_edit.date],
      heure_debut: [reservation_to_edit.heure_debut],
      heure_fin: [reservation_to_edit.heure_fin],
      evaluation: [reservation_to_edit.evaluation],
      // etat: [reservation_to_edit.etat, Validators.required],

      // statut: [reservation_to_edit.statut]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_reservation.controls; }
  // validation du formulaire
  onSubmit_edit_reservation() {
    this.submitted = true;
    console.log(this.reactiveForm_edit_reservation.value)
    // stop here if form is invalid
    if (this.reactiveForm_edit_reservation.invalid) {
      return;
    }
    var reservation = this.reactiveForm_edit_reservation.value
    this.edit_reservation({
      condition: { id_reservation: this.reservation_to_edit.id_reservation },
      data: reservation
    })
  }
  // vider le formulaire
  onReset_edit_reservation() {
    this.submitted = false;
    this.reactiveForm_edit_reservation.reset();
  }
  edit_reservation(reservation: any) {
    this.loading_edit_reservation = true;
    this.api.taf_post("reservation/edit", reservation, (reponse: any) => {
      if (reponse.status) {
        this.activeModal.close(reponse)
        console.log("Opération effectuée avec succés sur la table reservation. Réponse= ", reponse);
        //this.onReset_edit_reservation()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table reservation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_edit_reservation = false;
    }, (error: any) => {
      this.loading_edit_reservation = false;
    })
  }
  get_details_edit_reservation_form() {
    this.loading_get_details_edit_reservation_form = true;
    this.api.taf_post("reservation/get_form_details", {}, (reponse: any) => {
      if (reponse.status) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table reservation. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table reservation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_edit_reservation_form = false;
    }, (error: any) => {
      this.loading_get_details_edit_reservation_form = false;
    })
  }
}
