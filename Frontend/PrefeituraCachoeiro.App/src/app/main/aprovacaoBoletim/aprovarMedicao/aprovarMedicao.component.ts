import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AprovarMedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
import { MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-aprovarMedicao',
  templateUrl: './aprovarMedicao.component.html',
  styleUrls: ['./aprovarMedicao.component.scss']
})
export class AprovarMedicaoComponent implements OnInit {
  listaDocumentoContrato: ListaDocumentosContrato[] = [];
  @ViewChild('documentoInput') documentoInput: any;
  aprovarMedicoes: AprovarMedicoesRequest = new AprovarMedicoesRequest();
  isLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { idMedicoesProj: any, todasMedicoes: MedicoesResponse[], medicao: MedicoesResponse },
  private _toastService: ToastService, 
  private readonly api: MedicoesService,
  private dialogRef: MatDialogRef<AprovarMedicaoComponent>,
) { }

  ngOnInit() {
  }

  adicionarDocumento(){
    if(this.documentoInput.nativeElement.files[0] != undefined){
      const documentoFile = this.documentoInput.nativeElement.files[0] as File;
      this.listaDocumentoContrato.push({
        nome: documentoFile.name,
        file: documentoFile
      });   
      this.documentoInput.nativeElement.value = '';
    }
  }

    async criarAprovacao(){
      this.isLoading = true;

      if(this.data.idMedicoesProj){
        this.aprovarMedicoes.IdMedicoesProjeto = this.data.idMedicoesProj;
        this.aprovarMedicoes.Resumo = this.data.medicao.resumo;
        this.listaDocumentoContrato.forEach(x => this.aprovarMedicoes.Arquivos.push(x.file));
        
        await this.api.AprovarMedicoes(this.aprovarMedicoes)
        .then((result) => {     
          if(result.isSucesso){
            this.dialogRef.close(true);
            this._toastService.mensagemSuccess("Aprovação realizada com sucesso.");
          }
          else{
            this.dialogRef.close(false);
            this._toastService.mensagemError(result.mensagemErro);
          }
        })
        .catch((erro) =>
        {
          this.dialogRef.close(false);
          this._toastService.mensagemError(erro.error.message);
        })
        .finally(() =>{
          this.isLoading = false;
        });
      }
      else{
        if(this.data.todasMedicoes){
          this.data.todasMedicoes.forEach(async y => {
            this.aprovarMedicoes.Resumo = y.resumo;
            this.aprovarMedicoes.IdMedicoesProjeto = y.idMedicoesProjeto;
            this.listaDocumentoContrato.forEach(x => this.aprovarMedicoes.Arquivos.push(x.file));    

              await this.api.AprovarMedicoes(this.aprovarMedicoes)
              .then((result) => {     
                if(result.isSucesso){
                  this._toastService.mensagemSuccess("Aprovação realizada com sucesso.");
                }
                else{
                  this._toastService.mensagemError(result.mensagemErro);
                }
                this.dialogRef.close();
              })
              .catch((erro) =>
              {
                this._toastService.mensagemError(erro.error.message);
                this.isLoading = false;
              })
              .finally(() =>{
              })
          });          
        }
        this.isLoading = false;
      }
    }

  deletarDocumentos(deletarDocumento: ListaDocumentosContrato): void {
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    this.listaDocumentoContrato = this.listaDocumentoContrato.filter(item => item !== deletarDocumento);
  }

  voltar(){
    this.dialogRef.close();
  }
}
