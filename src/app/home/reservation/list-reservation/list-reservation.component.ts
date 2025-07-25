import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationCalendarComponent } from "../reservation-calendar/reservation-calendar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-reservation',
  standalone: true, // Composant autonome
  imports: [AddReservationComponent, CommonModule, EditReservationComponent, ReservationCalendarComponent], // Dépendances importées
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.scss']
})
export class ListReservationComponent {
  loading_get_reservation = false
  les_reservations: any[] = []
  selected_reservation: any = undefined
  reservation_to_edit: any = undefined
  loading_delete_reservation = false
  constructor(public api: ApiService, private modalService: NgbModal) {

  }
  ngOnInit(): void {
    this.get_reservation()
  }
  get_reservation() {
    this.loading_get_reservation = true;
    this.api.taf_post("reservation/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_reservations = reponse.data
        console.log("Opération effectuée avec succés sur la table reservation. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table reservation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_reservation = false;
    }, (error: any) => {
      this.loading_get_reservation = false;
    })
  }

  voir_plus(one_reservation: any) {
    this.selected_reservation = one_reservation
  }
  on_click_edit(one_reservation: any) {
    this.reservation_to_edit = one_reservation
  }
  on_close_modal_edit() {
    this.reservation_to_edit = undefined
  }
  delete_reservation(reservation: any) {
    this.loading_delete_reservation = true;
    this.api.taf_post("reservation/delete", reservation, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table reservation . Réponse = ", reponse)
        this.get_reservation()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table reservation  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_reservation = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_reservation = false;
      })
  }
  openModal_add_reservation() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddReservationComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_reservation()
      } else {

      }
    })
  }
  openModal_edit_reservation(one_reservation: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditReservationComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.reservation_to_edit = one_reservation;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_reservation()
      } else {

      }
    })
  }
}