import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
export class Editar_criar_empresaComponent implements OnInit {
  criarEmpresa: BaseEmpresaRequest = new BaseEmpresaRequest();
  atualizarEmpresa: AtualizarEmpresaRequest = new AtualizarEmpresaRequest();
  isLoading = false;
  emails: string[] = [];
  emailSerCadastrado: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmpresaResponse,
  private _toastService: ToastService,
  private readonly api: EmpresaService,
  private dialogRef: MatDialogRef<Editar_criar_empresaComponent>
) { 

  }

  ngOnInit(){
    if(this.data.email){
      let emailsCadastrados = this.data.email.split("; ");
      this.emails = emailsCadastrados;
    }
  }

  async cadastrar(){
    this.isLoading = true;
    this.criarEmpresa.Email = this.emails.join("; ");
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

  apenasNumeros(event: KeyboardEvent): void {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault(); // bloqueia letras e símbolos
    }
  }  

  onCnpjChange(value: string): void {
    this.criarEmpresa.CNPJ = value;
  }

  onCnpjUpdChange(value: string): void {
    this.data.cnpj = value;
  }

  formatarCNPJ(cnpj: string): string {
    cnpj = cnpj.replace(/\D/g, '');
  
    cnpj = cnpj.substring(0, 14);
  
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, '$1.$2.$3/$4-$5');
  }

  deletarEmail(item: string){
    this.emails = this.emails.filter(x => x !== item);
  }

  adicionarEmail(){
    let isValid = this.isEmailValid(this.emailSerCadastrado)
    console.log(isValid);
    console.log(!this.emails.some(x => x == this.emailSerCadastrado))
    if(isValid && !this.emails.some(x => x == this.emailSerCadastrado)){
      this.emails.push(this.emailSerCadastrado);
    }
    else{
      this._toastService.mensagemError("Email inválido ou ja existe");
    }
  }
  
  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onFileChange(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
  
    if (file) {
      if (file.type.startsWith('image/')) {
        this.criarEmpresa.Logo = file;
      } else {
        this._toastService.mensagemError("Você deve informar arquivos do tipo de imagem");
        fileInput.value = '';  // Limpa a seleção do input
      }
    }
  }  


  onFileChangeUpdate(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
  
    if (file) {
      if (file.type.startsWith('image/')) {
        this.atualizarEmpresa.Logo = file;
      } else {
        this._toastService.mensagemError("Você deve informar arquivos do tipo de imagem");
        fileInput.value = '';  // Limpa a seleção do input
      }
    }
  }  

  async salvar(){
    this.isLoading = true;

    this.atualizarEmpresa.EmpresaId = this.data.empresaId;
    this.atualizarEmpresa.Nome = this.data.nome;
    this.atualizarEmpresa.CNPJ = this.data.cnpj;
    this.atualizarEmpresa.Email = this.emails.join("; ");

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
