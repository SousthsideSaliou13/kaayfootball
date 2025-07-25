import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgxPaginationModule } from 'ngx-pagination';
import { Reservation } from '../../../models/reservation.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import moment from 'moment';
import { isToday as isDateToday, parseISO } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { DetailReservationComponent } from '../detail-reservation/detail-reservation.component';


@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FullCalendarModule, CommonModule, DatePipe, NgxPaginationModule],
  templateUrl: './reservation-calendar.component.html',
})
export class ReservationCalendarComponent implements OnChanges {
  @Input() reservations: Reservation[] = [];

  events: any[] = [];
  calendarOptions!: CalendarOptions;

  les_reservations: any[] = [];
  filteredReservations: any[] = [];
  selected_reservation: any = null;
  reservation_to_edit: any = null;
  loading_get_reservation = false;
  p = 1;
  filtre: string = 'all';


  constructor(private modalService: NgbModal, public api: ApiService) { }

  ngOnInit(): void {
    this.get_reservation();
  }

  ngOnChanges(): void {
    this.refreshCalendarEvents();
  }

  refreshCalendarEvents() {
    this.events = this.reservations.map(r => ({
      id: String(r.id_reservation),
      title: `${r.libelle_reservation || 'Reservée'}`,
      start: `${r.date}T${r.heure_debut}`,
      end: `${r.date}T${r.heure_fin}`,
      backgroundColor: this.colorByEtat(r.statut),
      borderColor: 'transparent',
      extendedProps: { reservation: r },
    }));

    this.calendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      locale: frLocale,
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek',
      },
      allDaySlot: false,
      slotMinTime: '12:00:00',
      slotMaxTime: '24:00:00',
      slotDuration: '00:30:00',
      editable: true,
      eventClick: (arg) => {
        const data = arg.event.extendedProps['reservation'];
        this.modalService.open(DetailReservationComponent, {
          centered: true,
          size: 'lg'
        }).componentInstance.data = data;
      },

      eventDrop: this.onEventDropResize.bind(this),
      eventResize: this.onEventDropResize.bind(this),
      events: this.events,
    };
  }

  isToday(dateString: string): boolean {
    return isDateToday(parseISO(dateString));
  }

  get_reservation() {
    this.loading_get_reservation = true;
    this.api.taf_post('reservation/get', { 'r.id_entreprise': this.api.current_entreprise.id_entreprise }, (reponse: any) => {
      if (reponse.status) {
        this.les_reservations = reponse.data;
        this.filteredReservations = [...this.les_reservations];
        this.reservations = [...this.les_reservations];
        this.refreshCalendarEvents();
      } else {
        this.api.Swal_error("L'opération a échoué");
      }
      this.loading_get_reservation = false;
    }, () => {
      this.loading_get_reservation = false;
    });
  }

  filterReservations(type: string): void {
    this.filtre = type; // <- ligne à ajouter
    const today = new Date();

    switch (type) {
      case 'today':
        this.filteredReservations = this.les_reservations.filter(event =>
          new Date(event.date).toDateString() === today.toDateString());
        break;
      case 'upcoming':
        this.filteredReservations = this.les_reservations.filter(event =>
          new Date(event.date) > today);
        break;
      default:
        this.filteredReservations = [...this.les_reservations];
        break;
    }
  }

  openModal_edit_reservation(reservation: Reservation) {
    const modalRef = this.modalService.open(EditReservationComponent, {
      centered: true, scrollable: true, size: 'lg', backdrop: 'static'
    });
    modalRef.componentInstance.reservation_to_edit = reservation;
    modalRef.result.then((result: any) => {
      if (result?.status) {
        this.get_reservation();
      }
    });
  }

  private onEventClick(arg: EventClickArg): void {
    const reserv = arg.event.extendedProps['reservation'] as Reservation;
    this.openModal_edit_reservation(reserv);
  }

  private onEventDropResize(arg: { event: any }): void {
    const reserv = arg.event.extendedProps['reservation'] as Reservation;

    reserv.date = arg.event.startStr.slice(0, 10);
    reserv.heure_debut = arg.event.startStr.slice(11, 16);
    reserv.heure_fin = arg.event.endStr.slice(11, 16);

    console.log('⏱️ Mise à jour par drag & drop:', reserv);
    // TODO: envoyer les modifs à l'API
  }

  colorByEtat(statut: string): string {
    switch (statut?.toLowerCase()) {
      case 'confirmee': return '#198754';
      case 'reservee': return '#0d6efd';
      case 'annulee': return '#dc3545';
      case 'terminee': return '#6c757d';
      default: return '#ffc107';
    }
  }
}
