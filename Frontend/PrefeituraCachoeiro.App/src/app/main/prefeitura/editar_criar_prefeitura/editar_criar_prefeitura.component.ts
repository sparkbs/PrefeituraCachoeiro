import { Component, Inject, OnInit } from '@angular/core';
import { ItemPrefeitura } from '../prefeitura/prefeitura.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar_criar_prefeitura',
  templateUrl: './editar_criar_prefeitura.component.html',
  styleUrls: ['./editar_criar_prefeitura.component.scss']
})
export class Editar_criar_prefeituraComponent implements OnInit {
  prefeitura: ItemPrefeitura;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ItemPrefeitura, 
  private dialogRef: MatDialogRef<Editar_criar_prefeituraComponent>
) { 
    console.log(this.data);
    if (data) {
      this.prefeitura = { ...data }; // Faz uma cópia do objeto data
    } else {
      this.prefeitura = { id:0,nomePrefeitura: "", criadoEm:"", acoes:""}; // Inicializa com valores padrão
    }
  }

  ngOnInit() {
  }

  salvar(){
    this.dialogRef.close(this.prefeitura);
  }
}
