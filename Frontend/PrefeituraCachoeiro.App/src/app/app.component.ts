import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Projeta.App';
  sidenavOpened = false;

  toggleSidenav(opened: boolean) {
    this.sidenavOpened = opened;
  }
}
