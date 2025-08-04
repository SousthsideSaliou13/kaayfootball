// list-reservation.component.ts
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
import frLocale from '@fullcalendar/core/locales/fr';

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
    initialView: 'timeGridWeek', // Start with week view, which is often more common for time slots
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay' // Ensure all views are selectable
    },
    // Setting the time range for the display
    slotMinTime: '00:00:00', // 8 PM (20h)
    slotMaxTime: '24:00:00', // 5 AM (05h) - FullCalendar handles overnight ranges
    nextDayThreshold: '00:00:00', // Ensure events spanning midnight are handled correctly
    nowIndicator: true,
    locale: frLocale, // Set calendar language to French
    eventColor: '#e94560', // Event background color
    eventTextColor: '#fff', // Event text color
    height: 'auto', // Let CSS control the container height
    expandRows: true, // Crucial for making it fill the container
    contentHeight: 'auto', // Adjusts content height dynamically
    editable: false, // Prevent dragging/resizing events
    events: [], // Your events will be loaded here
    eventClick: this.handleEventClick.bind(this),
    // Additional options to "embellir" and improve usability:
    allDaySlot: false, // Hide the "all-day" slot if not needed for reservations
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Force 24-hour format for slot labels
    },
    eventTimeFormat: { // Format time display on events
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    dayHeaderFormat: { // Format day headers (e.g., "lun. 4/8")
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        omitCommas: true
    },
    slotLabelInterval: { hours: 1 }, // Show labels every hour
    slotDuration: '00:15:00', // 15-minute intervals for events/dragging
    longPressDelay: 0, // Disable long press for mobile if not using interaction
    eventMinHeight: 15, // Minimum height for events to make them clickable
    // dayMaxEvents: true, // When in month view, show "more" link if too many events
    // views: { // Customizing specific views if needed
    //     timeGridWeek: {
    //         dayMaxEvents: 6 // Example: max 6 events before "more" link in week view
    //     }
    // }
  };

  // ... rest of your component code (constructor, ngOnInit, get_reservation, etc.) remains the same ...

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

        this.les_reservations = reponse.data.sort((a: any, b: any) => {
          const dateTimeA = new Date(`${a.date}T${a.heure_debut}`);
          const dateTimeB = new Date(`${b.date}T${b.heure_debut}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });

          // injecter dans FullCalendar (this part remains the same)
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
    let etat: any;
    if (reservation.etat == "actif") {
      etat = "inactif";
    } else {
      etat = "actif";
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