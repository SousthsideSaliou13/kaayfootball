import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddTypeReservationComponent } from '../add-type-reservation/add-type-reservation.component';
import { EditTypeReservationComponent } from '../edit-type-reservation/edit-type-reservation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-type-reservation',
  standalone: true, // Composant autonome
  imports: [CommonModule], // Dépendances importées
  templateUrl: './list-type-reservation.component.html',
  styleUrls: ['./list-type-reservation.component.scss']
})
export class ListTypeReservationComponent {
  loading_get_type_reservation = false
  les_type_reservations: any[] = []
  selected_type_reservation: any = undefined
  type_reservation_to_edit: any = undefined
  loading_delete_type_reservation = false
  constructor(public api: ApiService, private modalService: NgbModal) {

  }
  ngOnInit(): void {
    this.get_type_reservation()
  }
  get_type_reservation() {
    this.loading_get_type_reservation = true;
    this.api.taf_post("type_reservation/get", {}, (reponse: any) => {
      if (reponse.status) {
        this.les_type_reservations = reponse.data
        console.log("Opération effectuée avec succés sur la table type_reservation. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table type_reservation a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_type_reservation = false;
    }, (error: any) => {
      this.loading_get_type_reservation = false;
    })
  }

  voir_plus(one_type_reservation: any) {
    this.selected_type_reservation = one_type_reservation
  }
  on_click_edit(one_type_reservation: any) {
    this.type_reservation_to_edit = one_type_reservation
  }
  on_close_modal_edit() {
    this.type_reservation_to_edit = undefined
  }
  delete_type_reservation(type_reservation: any) {
    this.loading_delete_type_reservation = true;
    this.api.taf_post("type_reservation/delete", type_reservation, (reponse: any) => {
      //when success
      if (reponse.status) {
        console.log("Opération effectuée avec succés sur la table type_reservation . Réponse = ", reponse)
        this.get_type_reservation()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table type_reservation  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_type_reservation = false;
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_type_reservation = false;
      })
  }
  openModal_add_type_reservation() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddTypeReservationComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_type_reservation()
      } else {

      }
    })
  }
  openModal_edit_type_reservation(one_type_reservation: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditTypeReservationComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.type_reservation_to_edit = one_type_reservation;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status) {
        this.get_type_reservation()
      } else {

      }
    })
  }
}