import { Component, Inject, OnInit } from '@angular/core';
import { ItemPrefeitura } from '../prefeitura/prefeitura.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasePrefeituraRequest } from 'src/app/request/PrefeituraRequest/BasePrefeituraRequest';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { AtualizarPrefeituraRequest, DadosEnviadosAtualizarPrefeitura } from 'src/app/request/PrefeituraRequest/AtualizarPrefeituraRequest';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar_criar_prefeitura',
  templateUrl: './editar_criar_prefeitura.component.html',
  styleUrls: ['./editar_criar_prefeitura.component.scss']
})
export class Editar_criar_prefeituraComponent {
  criarPrefeitura: BasePrefeituraRequest = new BasePrefeituraRequest();
  atualizarPrefeitura: AtualizarPrefeituraRequest = new AtualizarPrefeituraRequest();

  constructor(@Inject(MAT_DIALOG_DATA) public data: PrefeituraResponse,
  private _toastService: ToastService,
   private readonly api: PrefeituraService,
  private dialogRef: MatDialogRef<Editar_criar_prefeituraComponent>
) { 

  }

  async cadastrar(){
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

    await this.api.AtualizarPrefeitura(this.atualizarPrefeitura)
    .then((result) => {
      this._toastService.mensagemSuccess("Cliente cadastrado com sucesso!");
      this.dialogRef.close(result);
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao cadastrar cliente!");
    });
  }

}
