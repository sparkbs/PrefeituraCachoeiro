import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    RouterModule
  ]
})
export class HomeModule { }
