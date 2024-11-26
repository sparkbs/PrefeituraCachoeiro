import { Component, Inject, OnInit } from '@angular/core';
import { ItemPrefeitura } from '../prefeitura/prefeitura.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasePrefeituraRequest } from 'src/app/request/PrefeituraRequest/BasePrefeituraRequest';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { AtualizarPrefeituraRequest, DadosEnviadosAtualizarPrefeitura } from 'src/app/request/PrefeituraRequest/AtualizarPrefeituraRequest';

@Component({
  selector: 'app-editar_criar_prefeitura',
  templateUrl: './editar_criar_prefeitura.component.html',
  styleUrls: ['./editar_criar_prefeitura.component.scss']
})
export class Editar_criar_prefeituraComponent implements OnInit {
  criarPrefeitura: BasePrefeituraRequest = new BasePrefeituraRequest();
  atualizarPrefeitura: AtualizarPrefeituraRequest = new AtualizarPrefeituraRequest();

  constructor(@Inject(MAT_DIALOG_DATA) public data: PrefeituraResponse, private readonly api: PrefeituraService,
  private dialogRef: MatDialogRef<Editar_criar_prefeituraComponent>
) { 

  }

  ngOnInit() {

    console.log(this.data);
  }

  async cadastrar(){
    console.log(this.criarPrefeitura);
    await this.api.CriarPrefeitura(this.criarPrefeitura)
    .then((result) => {
      this.dialogRef.close(result);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];  // Pega o primeiro arquivo selecionado
    if (file) {
      this.criarPrefeitura.Logo = file;  // Armazena o arquivo na variável 'logo'
    }
  }

  onFileChangeUpdate(event: any) {
    const file = event.target.files[0];  // Pega o primeiro arquivo selecionado
    if (file) {
      this.atualizarPrefeitura.Logo = file;  // Armazena o arquivo na variável 'logo'
    }
  }

  async salvar(){
    this.atualizarPrefeitura.IdPrefeitura = this.data.idPrefeitura;
    this.atualizarPrefeitura.Nome = this.data.nome;

    console.log(this.atualizarPrefeitura);
    await this.api.AtualizarPrefeitura(this.atualizarPrefeitura)
    .then((result) => {
      this.dialogRef.close(result);
    });
  }

}
