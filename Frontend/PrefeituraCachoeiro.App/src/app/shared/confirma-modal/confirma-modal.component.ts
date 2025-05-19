import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirma-modal',
  templateUrl: './confirma-modal.component.html',
  styleUrls: ['./confirma-modal.component.scss']
})
export class ConfirmaModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmaModalComponent>) { }

  ngOnInit() {
  }

  voltar(){
    this.dialogRef.close(false);
  }

  confirmar(){
    this.dialogRef.close(true);
  }

}
