import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirma-exclusao',
  templateUrl: './confirma-exclusao.component.html',
  styleUrls: ['./confirma-exclusao.component.scss']
})
export class ConfirmaExclusaoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmaExclusaoComponent>) { }

  ngOnInit() {
  }

  voltar(){
    this.dialogRef.close(false);
  }

  confirmar(){
    this.dialogRef.close(true);
  }

}
