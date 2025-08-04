import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-reservation',
  standalone: true,
  imports: [AddReservationComponent, EditReservationComponent, CommonModule, FullCalendarModule],
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.scss']
})
export class ListReservationComponent {
  loading_get_reservation = false;
  les_reservations: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    slotMinTime: '06:00:00',
    slotMaxTime: '23:00:00',
    nowIndicator: true,
    eventColor: '#198754',
    eventTextColor: '#fff',
     height: 'auto', // Keep auto for general responsiveness, but let CSS control the container
        expandRows: true, // Crucial for making it fill the container
        contentHeight: 'auto',
    editable: false,
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(public api: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.get_reservation();
  }

  get_reservation() {
    this.loading_get_reservation = true;
    const params = {
      id_entreprise: this.api.current_entreprise.id_entreprise,
    };

    this.api.taf_post("reservation/get", params, (reponse: any) => {
      if (reponse.status) {
        this.les_reservations = reponse.data;

        // injecter dans FullCalendar
        this.calendarOptions.events = this.les_reservations.map(r => ({
          id: r.id_reservation,
          title: r.libelle_reservation,
          start: `${r.date}T${r.heure_debut}`,
          end: `${r.date}T${r.heure_fin}`,
          extendedProps: r
        }));
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_reservation = false;
    }, () => {
      this.loading_get_reservation = false;
    });
  }

  handleEventClick(arg: any) {
    const reservation = arg.event.extendedProps;
    this.openModal_edit_reservation(reservation);
  }

  openModal_add_reservation() {
    const modalRef = this.modalService.open(AddReservationComponent, { centered: true, scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.result.then((result: any) => {
      if (result?.status) this.get_reservation();
    });
  }

  openModal_edit_reservation(reservation: any) {
    const modalRef = this.modalService.open(EditReservationComponent, { centered: true, scrollable: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reservation_to_edit = reservation;
    modalRef.result.then((result: any) => {
      if (result?.status) this.get_reservation();
    });
  }

  delete_reservation(reservation: any) {

    let etat: any
    if (reservation.etat == "actif") {
      etat = "inactif"
    } else {
      etat = "actif"
    }

    this.api.taf_post("reservation/edit", { condition: { id_reservation: reservation.id_reservation }, data: { etat: etat } }, (reponse: any) => {
      if (reponse.status) {
        this.api.Swal_success("Suppression réussie");
        this.get_reservation();
      } else {
        this.api.Swal_error("La suppression a échoué");
      }
    }, () => {
      this.api.Swal_error("La suppression a échoué");
    });
  }
}
