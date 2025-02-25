import { AfterViewInit, Component, Inject, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AtualizarContratoRequest } from 'src/app/request/ContratoRequest/atualizarContratoRequest';
import { UsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
import { ContratosResponse, PrefeituraResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar_contratos',
  templateUrl: './editar_contratos.component.html',
  styleUrls: ['./editar_contratos.component.scss']
})
export class Editar_contratosComponent implements OnInit, AfterViewInit {
  @ViewChild('documentoInput') documentoInput: any;
  listaPrefeitura: PrefeituraResponse[] = [];
  atualizarContrato: AtualizarContratoRequest = new AtualizarContratoRequest();
  listaDocumentoContrato: ListaDocumentosContrato[] = [{
    nome: 'documento.pdf',
    file: null
  }];
  dataTerminoString: string;
  dataInicioString: string;
  dataContratoString: string;
  listaGerentes: UsuariosResponse[] = [];

  constructor( @Inject(MAT_DIALOG_DATA) public data: ContratosResponse,
  private readonly apiPrefeitura: PrefeituraService,
   private dialogRef: MatDialogRef<Editar_contratosComponent>,
   private readonly api: ContratosService,
     private readonly apiUsuarios: UsuariosService
  ) { }

  async ngAfterViewInit() {
    await this.buscarListaGerentes();
    this.dataInicioString = this.exibirData(this.data.dataInicio)
    this.dataTerminoString = this.exibirData(this.data.dataTermino)
    this.dataContratoString = this.exibirData(this.data.dataContrato)
    }

  async ngOnInit() {
    await this.buscarListaPrefeituras();
  }

  async buscarListaGerentes(){
    var usuarioRequest : UsuariosRequest = new UsuariosRequest();
    usuarioRequest.nome = "";
    usuarioRequest.itemsPorPagina = 1000000;
    usuarioRequest.pagina = 1;
    await this.apiUsuarios.BuscarTodosUsuarios(usuarioRequest)
    .then((result) => {
      this.listaGerentes = result.data;
    });
  }


  async buscarListaPrefeituras(){
    var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
    prefeituraFilter.nome = "";
    prefeituraFilter.itemsPorPagina = 1000000;
    prefeituraFilter.pagina = 1;
    await this.apiPrefeitura.BuscarTodasPrefeituras(prefeituraFilter)
    .then((result) => {
      this.listaPrefeitura = result.data;
    });
  }

exibirData(data: Date){
  let dataFormatada:string;
  if (data instanceof Date && !isNaN(data.getTime())) {
    dataFormatada = this.formatDateToString(data);
  } else if (data) {
    data = new Date(data); 
    if (isNaN(data.getTime())) {
    } else {
      dataFormatada = this.formatDateToString(data);
    }
  } else {
    console.error('dataTermino não está definido ou é inválido');
  }

  return dataFormatada;
}

formatDateToString(date: Date): string {
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getUTCFullYear(); // Usa o ano no formato UTC
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Usa o mês no formato UTC
    const day = date.getUTCDate().toString().padStart(2, '0'); // Usa o dia no formato UTC
    return `${year}-${month}-${day}`;
  } else {
    console.error('Data inválida fornecida');
    return '';
  }
}


async salvar(){
  this.atualizarContrato.DataContrato = (this.dataContratoString);
  this.atualizarContrato.DataInicio = (this.dataInicioString);
  this.atualizarContrato.DataTermino = (this.dataTerminoString);
  this.atualizarContrato.EmpresaId = this.data.empresaId;
  this.atualizarContrato.Gerente = this.data.gerente;
  this.atualizarContrato.IdContrato = this.data.idContrato;
  this.atualizarContrato.NumeroContrato = this.data.numeroContrato;
  this.atualizarContrato.PrefeituraId = this.data.prefeituraId;
  this.atualizarContrato.TipoContratacao = this.data.tipoContratacao;
  //retirar o valor
  
  await this.api.AtualizarContrato(this.atualizarContrato)
  .then((result) => {
    this.dialogRef.close(result);
  });
}

formatStringToDate(data: string) {
  let dataConvertidaDate: string;
  if (data) {
    const [year, month, day] = data.split('-').map(Number);
    dataConvertidaDate = `${year}-${month}-${day}`;
  }
  return dataConvertidaDate;
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

  deletarDocumentos(deletarDocumento: ListaDocumentosContrato): void {
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    this.listaDocumentoContrato = this.listaDocumentoContrato.filter(item => item !== deletarDocumento);
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
      this.data.valor = ''; // Ou você pode definir um valor padrão
      return;
    }
    value = (parseInt(value) || 0).toString(); 
    value = value.padStart(3, '0'); 
    value = value.slice(0, -2) + ',' + value.slice(-2); 
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    value = 'R$ ' + value; 
    this.data.valor = value; 
  }

}
