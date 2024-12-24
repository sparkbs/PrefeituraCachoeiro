import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boletim',
  templateUrl: './boletim.component.html',
  styleUrls: ['./boletim.component.scss'],
})
export class BoletimComponent {

  constructor(private _router: Router) { }

}
