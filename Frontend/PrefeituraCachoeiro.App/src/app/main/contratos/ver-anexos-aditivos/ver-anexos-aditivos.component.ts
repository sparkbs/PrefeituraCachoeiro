import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AditivosContratoRequest } from 'src/app/request/ContratoRequest/aditivosContratoRequest';
import { BuscarAditivosContrato } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { CriarContratoRequest, salvarDocumentoAditivoRequest } from 'src/app/request/ContratoRequest/criarContratoRequest';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
import { ContratosAditivosResponse, ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ver-anexos-aditivos',
  templateUrl: './ver-anexos-aditivos.component.html',
  styleUrls: ['./ver-anexos-aditivos.component.scss']
})
export class VerAnexosAditivosComponent {
  lista: ContratosAditivosResponse;
  displayedColumns: string[] = ['tipoAditivo', 'descricao', 'valor', 'dataAssinatura', 'validadeAditivo', 'acoes'];
  dataSource: MatTableDataSource<ContratosAditivosResponse>;
  valorAditivo: string;
  contratoBase: ContratosResponse;
  listaDocumentoContrato: ListaDocumentosContrato[] = [];
  requestCriarAditivo: AditivosContratoRequest = new AditivosContratoRequest();
  @ViewChild('baseDadosInput') baseDadosInput: any;
  @ViewChild('documentoInput') documentoInput: any;
  isLoading = false;
  isAditivoQuantidade = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ContratosAditivosResponse, private readonly api: ContratosService, private _toastService: ToastService,   private dialogRef: MatDialogRef<VerAnexosAditivosComponent>, ) {
    console.log(this.data.arquivosAditivos);
    this.lista = this.data; 
  }

  /*async ngAfterViewInit() {
    this.contratoBase = this.data.contratobase;
    var aditivoFilter : BuscarAditivosContrato = new BuscarAditivosContrato();
    aditivoFilter.idContrato = this.data.contratobase.idContrato;
    await this.api.BuscarTodosAditivos(aditivoFilter)
    .then((result) => {
      result.data.forEach((item) => {
        // Soma o valorTotalComBdi de cada item
        item.valorTotal = 0;
        item.items.forEach(x =>{
          item.valorTotal += x.unidade * x.valorComBdi;
        });
      });

      this.lista = result.data;
      this.dataSource.data = (this.lista);         
    });
  }*/

  onTipoAditivoChange(){
    if(this.requestCriarAditivo.TipoAditivo == "Aditivo de Quantidades"){
      this.isAditivoQuantidade = true;
    }
    else{
      this.isAditivoQuantidade = false;
    }
  }

  deletarDocumentos(deletarDocumento: ListaDocumentosContrato): void {
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    this.listaDocumentoContrato = this.listaDocumentoContrato.filter(item => item !== deletarDocumento);
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

  fechar(){
    this.dialogRef.close();
  }

  adicionarBaseDados(){
    if(this.baseDadosInput.nativeElement.files[0] != undefined){
      const documentoFile = this.baseDadosInput.nativeElement.files[0] as File;
      return documentoFile;
    }
    else{
      return null;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (!allowedKeys.includes(event.key) && (event.key < '0' || event.key > '9')) {
      event.preventDefault(); // Impede a entrada de letras
    }
  }
  
  formatCurrency(event: any): void { 
    let value = event.target.value.toString();
    value = value.replace(/\D/g, ''); 
    if (value === '') {
      this.valorAditivo = ''; // Ou você pode definir um valor padrão
      return;
    }
    value = (parseInt(value) || 0).toString(); 
    value = value.padStart(3, '0'); 
    value = value.slice(0, -2) + ',' + value.slice(-2); 
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    value = 'R$ ' + value; 
    this.valorAditivo = value; 
  }

  formatToCurrency(valor: number): string {
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    valorFormatado = valorFormatado.replace('.', ',');

    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + valorFormatado;
  }

  async downloadDocumentosAditivos(idDocumento: number, arquivo:string) {    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.api.DownloadArquivoAditivo(idDocumento)
    .then((result) => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo;  // Você pode definir o nome do arquivo
      a.click();
      window.URL.revokeObjectURL(url);  // Limpar a URL após o download
      this._toastService.mensagemSuccess("Download realizado com sucesso.");
    })
    .catch(() =>
    {
      this._toastService.mensagemError("Erro ao realizar download documento.");
    })
    .finally(()=>{
    });
  }

  async deletarDocumento(idDocumento: number) {
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.api.DeletarArquivoAditivo(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Documento deletado com sucesso.");
      this.lista.arquivosAditivos = this.lista.arquivosAditivos.filter(x => x.id != idDocumento);
    })
    .catch(() =>
    {
      this._toastService.mensagemSuccess("Erro ao deletar documento.");
    })
    .finally(()=>{
    });
  }

  async adicionarAditivo(){
    if(this.documentoInput.nativeElement.files[0] != undefined){
      var id = this.data.idAditivo;
      const documentoFile = this.documentoInput.nativeElement.files[0] as File;
      let documentoRequest: salvarDocumentoAditivoRequest = new salvarDocumentoAditivoRequest();
      documentoRequest.IdAditivo = id,
      documentoRequest.Arquivos = [documentoFile];
      this.listaDocumentoContrato.push({
        nome: documentoFile.name,
        file: documentoFile
      }); 
      /*this.listaDocumentoContrato.push({
        //a: documentoFile.name,
        //file: documentoFile
      });   
      this.documentoInput.nativeElement.value = '';
    }*/
      this.documentoInput.nativeElement.value = '';
      this.isLoading = true;
      // Filtra os documentos, removendo o que for igual ao item a ser deletado
      await this.api.AdicionarDocumentosAditivo(documentoRequest)
      .then(async (result) => {
        this.lista.arquivosAditivos.push(...result.ids);
        this._toastService.mensagemSuccess("Documento importado com sucesso.");
      })
      .catch(() =>
      {
        this._toastService.mensagemSuccess("Erro ao importar documento.");
      })
      .finally(()=>{
        this.isLoading = false;
      });
    }
  }  

}
