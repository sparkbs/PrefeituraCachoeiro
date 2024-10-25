import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  sidenavOpened: boolean = false;
  currentRoute: string = '';

  constructor(
    private authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2,
    private _router: Router) {
      this.currentRoute = this._router.url;
  }

  ngOnInit() {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });

    console.log(this.currentRoute);
  }

  toggleSidenav(opened: boolean) {
    this.sidenavOpened = opened;

    const sidenavElement = this.el.nativeElement.querySelector('.sidebar');
    const sidenavButtonContentElement = this.el.nativeElement.querySelectorAll('.sidebar button > span');
    const sidenavButtonDescElement = this.el.nativeElement.querySelectorAll('.sidebar button > span > span');

    if (opened) {
      this.renderer.addClass(sidenavElement, 'sidebar-expanded');

        sidenavButtonDescElement.forEach((span: HTMLSpanElement) => {
          span.style.opacity = '1';
          span.style.visibility = 'visible';
          span.style.transition = 'all 0.35s';
        });

        sidenavButtonContentElement.forEach((span: HTMLSpanElement) => {
          span.style.width = '242px';
        });
    }
    else {
      this.renderer.removeClass(sidenavElement, 'sidebar-expanded');

      sidenavButtonDescElement.forEach((span: HTMLSpanElement) => {
        span.style.opacity = '0';
        span.style.visibility = 'hidden';
      });

      sidenavButtonContentElement.forEach((span: HTMLSpanElement) => {
        span.style.width = 'none';
      });
    }
  }
}
