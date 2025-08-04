import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// declare function initialize(): any;
declare function initialize(): any;

@Component({
  selector: 'app-sidbar',
  imports: [RouterModule , CommonModule],
  templateUrl: './sidbar.component.html',
  styleUrl: './sidbar.component.scss'
})
export class SidbarComponent implements OnInit {

  isMenuOpen = false;
  showBackdrop = false;          // 👈  nouvel indicateur géré par le composant
  readonly LG_BREAKPOINT = 992;
  constructor(public api : ApiService, private modalService: NgbModal,) {

   }
  ngOnInit(): void {
    setTimeout(() => {
      initialize();
    }, 1500);
  }

   @HostListener('window:resize')
  onResize(): void {
    this.handleBreakpoint();
  }

  toggleMenu(force?: boolean): void {
    this.isMenuOpen = force !== undefined ? force : !this.isMenuOpen;
    this.syncClasses();
    this.updateBackdrop();       // 👈  on (dé)mask le backdrop
  }

  private handleBreakpoint(): void {
    const isDesktop = window.innerWidth >= this.LG_BREAKPOINT;

    if (!isDesktop && this.isMenuOpen === false) {
      // mobile : on s’assure que tout est clean
      this.syncClasses(false);
    }

    // si on passe desktop : on ferme et on enlève le backdrop
    if (isDesktop && this.isMenuOpen) {
      this.toggleMenu(false);
    }
  }

  private syncClasses(forceOpen: boolean = this.isMenuOpen): void {
    document.documentElement.classList.toggle(
      'layout-menu-expanded',
      forceOpen
    );
    document.body.classList.toggle('menu-open', forceOpen);
  }

  public updateBackdrop(): void {
    this.showBackdrop =
      this.isMenuOpen && window.innerWidth < this.LG_BREAKPOINT;
  }
}
