import { Component, Input, OnChanges } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgxPaginationModule } from 'ngx-pagination';
import { Reservation } from '../../../models/reservation.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservation-calendar',
  imports: [FullCalendarModule, CommonModule, DatePipe, NgxPaginationModule],
  templateUrl: './reservation-calendar.component.html',
  standalone: true,
})
export class ReservationCalendarComponent implements OnChanges {
  constructor(private modalService: NgbModal, public api: ApiService) { }
  /** Tableau passé par le parent */
  @Input() reservations: Reservation[] = [];
  events: any[] = [];
  loading_get_reservation = false
  les_reservations: any[] = []
  selected_reservation: any = undefined
  reservation_to_edit: any = undefined
  loading_delete_reservation = false
  p: number = 1;

  /** Options FullCalendar */
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    locale: frLocale,
    initialView: 'timeGridWeek',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek',
    },

    allDaySlot: false,
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    slotDuration: '00:30:00',
    editable: true,                // drag & drop + resize
    eventClick: this.onEventClick.bind(this),
    eventDrop: this.onEventDropResize.bind(this),
    eventResize: this.onEventDropResize.bind(this),

    events: this.reservations.map(r => ({
      classNames: [`fc-event-${r.etat.replace(/\s+/g, '-').toLowerCase()}`]
    }))                    // alimenté dans ngOnChanges
  };
  ngOnInit(): void {
    this.get_reservation()
    this.filterReservations('all')
  }

  filteredReservations = [...this.les_reservations];

  // Fonction de filtrage des réservations
  filterReservations(type: string): void {
    const today = new Date();
    switch (type) {
      case 'all':
        this.filteredReservations = [...this.les_reservations];
        this.get_reservation()
        break;
      case 'today':
        this.filteredReservations = this.les_reservations.filter(event => new Date(event.date).toDateString() === today.toDateString());
        this.get_reservation()
        break;
      case 'upcoming':
        this.filteredReservations = this.les_reservations.filter(event => new Date(event.date) > today);
        this.get_reservation()
        break;
      default:
        this.filteredReservations = [...this.les_reservations];
        this.get_reservation()
        break;
    }
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



  /* ---------- cycle de vie ---------- */
  ngOnChanges(): void {
    this.calendarOptions.events = this.reservations.map(r => ({
      id: String(r.id_reservation),
      title: r.libelle_reservation ?? `Réservation #${r.id_reservation}`,
      start: `${r.date}T${r.heure_debut}`,
      end: `${r.date}T${r.heure_fin}`,
      backgroundColor: this.colorByEtat(r.statut),
      borderColor: 'transparent',
      extendedProps: { reservation: r },
    }));
  }

  /* ---------- handlers ---------- */
  private onEventClick(arg: EventClickArg): void {
    const reserv = arg.event.extendedProps['reservation'] as Reservation;
    // TODO : ouvrir ta fenêtre d’édition
    this.openModal_edit_reservation(reserv);
    console.log('🖊️  Éditer', reserv);
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

  private onEventDropResize(arg: { event: any }): void {
    const reserv = arg.event.extendedProps['reservation'] as Reservation;

    // maj heure et date
    reserv.date = arg.event.startStr.slice(0, 10);
    reserv.heure_debut = arg.event.startStr.slice(11, 16);
    reserv.heure_fin = arg.event.endStr.slice(11, 16);

    // TODO : appel API PUT /reservations/{id}
    console.log('💾  Mise à jour', reserv);
  }

  /* ---------- utilitaires ---------- */
  private colorByEtat(statut: string): string {
    switch (statut) {
      case 'confirmée': return '#198754'; // vert
      case 'annulée': return '#dc3545'; // rouge
      default: return '#0d6efd'; // bleu
    }
  }

  build_all_events(data: any[]) {
    const to_show: any[] = [];

    data.forEach((one: any) => {
      const start = moment(one.heure_debut);
      const end = one.heure_fin ? moment(one.heure_fin) : start.clone().add(1, 'hour');
      const current = start.clone();

      while (current.isSameOrBefore(end, 'day')) {
        const eventStart = current.clone().set({ hour: 8, minute: 0, second: 0 }).format('YYYY-MM-DDTHH:mm:ss');
        const eventEnd = current.clone().set({ hour: 18, minute: 0, second: 0 }).format('YYYY-MM-DDTHH:mm:ss');

        to_show.push({
          //Slice pour prendre juste les 5 premier characteres de l'heure
          title: `${one.heure_debut} ${one.libelle_reservation}`,
          start: eventStart,
          end: eventEnd,
          allDay: false,
          backgroundColor: "rgb(27,187,140)",
          borderColor: "rgb(231, 121, 18)",
          textColor: "white",
          classNames: ["event-coaching"],
          extendedProps: {
            id_reservation: one.id_reservation,
            raw: one
          }
        });

        current.add(1, 'day');
      }
    });

    this.events = [...to_show];
    console.log("✅ events = ", this.events);
  }
  // onEventClick(event: any) {
  //   // let data = event.event._def.extendedProps.data
  //   const data = event.event.extendedProps.raw;
  //   console.log("data = ", data);
  //   // this.router.navigate(["/home/detail_coaching", data.id_coaching])
  //   // this.openModal_detail_coaching(data)
  // }
  eventContent(info: any) {
    const eventEl = document.createElement('div');
    eventEl.innerHTML = info.event.title;
    return { domNodes: [eventEl] };
  }
}
