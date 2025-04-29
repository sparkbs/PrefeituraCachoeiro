import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasePrefeituraRequest } from 'src/app/request/PrefeituraRequest/BasePrefeituraRequest';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { AtualizarPrefeituraRequest, DadosEnviadosAtualizarPrefeitura } from 'src/app/request/PrefeituraRequest/AtualizarPrefeituraRequest';
import { ToastService } from 'src/app/services/toast.service';
import { BaseEmpresaRequest } from 'src/app/request/EmpresaRequest/BaseEmpresaRequest';
import { EmpresaService } from 'src/app/services/empresa.service';
import { AtualizarEmpresaRequest } from 'src/app/request/EmpresaRequest/AtualizarEmpresaRequest';
import { EmpresaResponse } from 'src/app/response/contratosResponse/todosContratosResponse';

@Component({
  selector: 'app-editar_criar_empresa',
  templateUrl: './editar_criar_empresa.component.html',
  styleUrls: ['./editar_criar_empresa.component.scss']
})
export class Editar_criar_empresaComponent {
  criarEmpresa: BaseEmpresaRequest = new BaseEmpresaRequest();
  atualizarEmpresa: AtualizarEmpresaRequest = new AtualizarEmpresaRequest();
  isLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmpresaResponse,
  private _toastService: ToastService,
  private readonly api: EmpresaService,
  private dialogRef: MatDialogRef<Editar_criar_empresaComponent>
) { 

  }

  async cadastrar(){
    this.isLoading = true;
    console.log(this.criarEmpresa);
    await this.api.CriarEmpresa(this.criarEmpresa)
    .then((result) => {
      this._toastService.mensagemSuccess("Emrpesa criado com sucesso");
      this.dialogRef.close(result);
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() => {
      this.isLoading = false
    })
    ;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];  // Pega o primeiro arquivo selecionado
    if (file) {
      this.criarEmpresa.Logo = file;  // Armazena o arquivo na variável 'logo'
    }
  }

  onFileChangeUpdate(event: any) {
    const file = event.target.files[0];  // Pega o primeiro arquivo selecionado
    if (file) {
      this.atualizarEmpresa.Logo = file;  // Armazena o arquivo na variável 'logo'
    }
  }

  async salvar(){
    this.isLoading = true;

    this.atualizarEmpresa.EmpresaId = this.data.empresaId;
    this.atualizarEmpresa.Nome = this.data.nome;
    this.atualizarEmpresa.CNPJ = this.data.cnpj;

    await this.api.AtualizarEmpresa(this.atualizarEmpresa)
    .then((result) => {
      this._toastService.mensagemSuccess("Empresa editado com sucesso!");
      this.dialogRef.close(result);
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() => {
      this.isLoading = false
    });
  }

}
