import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AprovarMedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
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

  constructor(@Inject(MAT_DIALOG_DATA) public IdMedicoesProj: any, 
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

      if(this.IdMedicoesProj.idMedicoesProj){
        this.aprovarMedicoes.IdMedicoesProjeto = this.IdMedicoesProj.idMedicoesProj;
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
        .catch(() =>
        {
          this._toastService.mensagemError("Erro ao aprovar uma medição.");
        })
        .finally(() =>{
          this.isLoading = false;
        });
      }
      else{
        if(this.IdMedicoesProj.todasMedicoes){
          this.IdMedicoesProj.todasMedicoes.forEach(async y => {
            
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
              .catch(() =>
              {
                this._toastService.mensagemError("Erro ao aprovar uma medição.");
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
