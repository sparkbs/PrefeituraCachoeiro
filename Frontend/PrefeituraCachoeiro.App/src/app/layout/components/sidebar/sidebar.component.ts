import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs';
import { PerfilLogin } from 'src/app/enums/perfilLogin';
import { ModalLevantamentoComponent } from 'src/app/main/relatorios/modalLevantamento/modalLevantamento.component';
import { AuthService } from 'src/app/services/auth.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  sidenavOpened: boolean = false;
  relatoriosExpanded = false;
  hasPrefeitura: boolean = false;
  UserRole = PerfilLogin; // necessário para usar no template
  userLogin: string;

  constructor(
    private authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2,
    private cookieService: CookieService,
    public dialog: MatDialog,
    private readonly aesEncryptDecript: AESEncryptDecriptService) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hasPrefeitura = !!this.cookieService.get('_idPrefeitura');
    }, 1000);
  }

  ngOnInit() {
    const cookieValue = this.authService.getCookie('_acesso');
    this.userLogin = this.aesEncryptDecript.decrypt(cookieValue);
  }

  toggleSidenav(opened: boolean) {
    this.sidenavOpened = opened;

    const sidenavElement = this.el.nativeElement.querySelector('.sidebar');
    const sidenavButtonContentElement = this.el.nativeElement.querySelectorAll('.sidebar button > span');
    const sidenavButtonDescElement = this.el.nativeElement.querySelectorAll('.sidebar button > span > span');
    const sidenavTextMenu = this.el.nativeElement.querySelectorAll('.menu div > span');
    let sidenavIconExpandMenu = this.el.nativeElement.querySelector('.collapsed-menu');
    const sidenavSubMenu = this.el.nativeElement.querySelectorAll('.submenu > button');

    if (!sidenavIconExpandMenu) {
      sidenavIconExpandMenu = this.el.nativeElement.querySelector('.expanded-menu');
    }

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

        sidenavTextMenu.forEach((span: HTMLSpanElement) => {
          span.style.opacity = '1';
          span.style.visibility = 'visible';
          span.style.transition = 'all 0.35s';
        });

        this.renderer.removeClass(sidenavIconExpandMenu, 'collapsed-menu');
        this.renderer.addClass(sidenavIconExpandMenu, 'expanded-menu');
        if (sidenavSubMenu) {
          sidenavSubMenu.forEach((button: HTMLElement) => {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.transition = 'all 0.35s';
          });
        }

    }
    else {
      this.renderer.removeClass(sidenavElement, 'sidebar-expanded');
      this.renderer.removeClass(sidenavIconExpandMenu, 'expanded-menu');
      this.renderer.addClass(sidenavIconExpandMenu, 'collapsed-menu');
      if (sidenavSubMenu) {
        sidenavSubMenu.forEach((button: HTMLElement) => {
          button.style.opacity = '0';
          button.style.visibility = 'hidden';
        });
      }

      sidenavButtonDescElement.forEach((span: HTMLSpanElement) => {
        span.style.opacity = '0';
        span.style.visibility = 'hidden';
      });

      sidenavButtonContentElement.forEach((span: HTMLSpanElement) => {
        span.style.width = 'none';
      });

      sidenavTextMenu.forEach((span: HTMLSpanElement) => {
        span.style.opacity = '0';
        span.style.visibility = 'hidden';
      });
    }
  }

  toggleRelatorios() {
    this.relatoriosExpanded = !this.relatoriosExpanded;
  }
}
