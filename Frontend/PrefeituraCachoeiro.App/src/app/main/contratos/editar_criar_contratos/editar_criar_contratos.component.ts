import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../contratos.component';

@Component({
  selector: 'app-editar_criar_contratos',
  templateUrl: './editar_criar_contratos.component.html',
  styleUrls: ['./editar_criar_contratos.component.scss']
})
export class Editar_criar_contratosComponent implements OnInit {
  contratos: Item;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Item, 
  private dialogRef: MatDialogRef<Editar_criar_contratosComponent>
) { 
    console.log(this.data);
    if (data) {
      this.contratos = { ...data }; // Faz uma cópia do objeto data
    } else {
      this.contratos = { id:0,nomePrefeitura: "", dataInicioEFim:"",consorcio:"",gerente:"",valorContrato:0,tipoContratacao:"", acoes:""}; // Inicializa com valores padrão
    }
  }

  ngOnInit() {
  }

  salvar(){
    this.dialogRef.close(this.contratos);
  }
}
