import { AfterViewInit, Component, Inject, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrigemArquivoAnexadoEnum } from 'src/app/enums/origemArquivoAnexado';
import { AtualizarContratoRequest } from 'src/app/request/ContratoRequest/atualizarContratoRequest';
import { salvarDocumentoContratoRequest } from 'src/app/request/ContratoRequest/criarContratoRequest';
import { UsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
import { ArquivosContratoResponse, ContratosResponse, EmpresaResponse, PrefeituraResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ToastService } from 'src/app/services/toast.service';
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
  listaDocumentoContrato: ArquivosContratoResponse[] = [];
  dataTerminoString: string;
  dataTerminoAtualizadaString: string;
  dataInicioString: string;
  dataContratoString: string;
  listaGerentes: UsuariosResponse[] = [];
  isLoading = false;
  listaEmpresa: EmpresaResponse[] = [];
  listaFiltrada: any[] = [];
  nomeCliente: string;
  listaGerenteFiltrada: any[] = [];
  selectedGerente: number | null = null; // Valor selecionado
  nomeGerente: string;
  selectedEmpresa: number | null = null; // Valor selecionado
  nomeEmpresa: string;
  listaEmpresaFiltrada: any[] = [];

  constructor( @Inject(MAT_DIALOG_DATA) public data: ContratosResponse,
  private readonly apiMedicao: MedicoesService,
  private readonly apiPrefeitura: PrefeituraService,
   private dialogRef: MatDialogRef<Editar_contratosComponent>,
   private readonly api: ContratosService,
  private readonly apiUsuarios: UsuariosService,
    private readonly apiEmpresa: EmpresaService,
  private _toastService: ToastService
  ) { }

  async ngAfterViewInit() {
    await this.buscarListaGerentes();
    this.dataInicioString = this.exibirData(this.data.dataInicio)
    this.dataTerminoAtualizadaString = this.data.dataTerminoAtualizada ? this.exibirData(this.data.dataTerminoAtualizada) : this.exibirData(this.data.dataTermino)
    this.dataTerminoString = this.exibirData(this.data.dataTermino)
    this.dataContratoString = this.exibirData(this.data.dataContrato)
    }

  async ngOnInit() {
    this.isLoading = true;
    await this.buscarListaempresas();
    await this.buscarListaPrefeituras();
    await this.buscarListaGerentes();
    this.listaFiltrada = [...this.listaPrefeitura];
    this.nomeCliente = this.listaPrefeitura?.find(x => x.idPrefeitura == this.data.prefeituraId)?.nome;
    this.listaGerenteFiltrada = [...this.listaGerentes];
    this.nomeGerente = this.listaGerentes?.find(x => x.nome == this.data.gerente)?.nome;
    this.listaEmpresaFiltrada = [...this.listaEmpresa];
    this.nomeEmpresa = this.listaEmpresa?.find(x => x.empresaId == this.data.empresaId)?.nome;
    this.isLoading = false;
  }

  async buscarListaGerentes(){
    var usuarioRequest : UsuariosRequest = new UsuariosRequest();
    usuarioRequest.nome = "";
    usuarioRequest.itemsPorPagina = 1000000;
    usuarioRequest.pagina = 1;
    await this.apiUsuarios.BuscarTodosUsuarios(usuarioRequest)
    .then((result) => {
      this.listaGerentes = result.data.filter(x => x.prefeituraId == null);
    })
    .catch(() =>{
      this.isLoading = false;
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
    })
    .catch(() => {
      this.isLoading = false;
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

  async onSelectionChange(nome: string){
    var prefeituraId = this.listaPrefeitura.find(x => x.nome === nome).idPrefeitura;
    this.data.prefeituraId = prefeituraId;
  }

  filtrarPrefeitura(valor: string) {
    // Filtra a lista com base no valor digitado
    this.listaFiltrada = this.listaPrefeitura.filter(prefeitura => 
      prefeitura.nome.toLowerCase().includes(valor.toLowerCase())
    );
  }

 filtrarGerente(valor: string) {
    // Filtra a lista com base no valor digitado
    this.listaGerenteFiltrada = this.listaGerentes.filter(gerente => 
      gerente.nome.toLowerCase().includes(valor.toLowerCase())
    );
  }

  async onSelectionGerenteChange(nome: string){
    this.data.gerente = nome;
    var gerenteId = this.listaGerentes.find(x => x.nome === nome).idUsuario;
    this.atualizarContrato.GerenteId = gerenteId;
  }

  filtrarEmpresa(valor: string) {
    // Filtra a lista com base no valor digitado
    this.listaEmpresaFiltrada = this.listaEmpresa.filter(empresa => 
      empresa.nome.toLowerCase().includes(valor.toLowerCase())
    );
  }
  
  async onSelectionEmpresaChange(nome: string){
    var empresaId = this.listaEmpresa.find(x => x.nome === nome).empresaId;
    this.data.empresaId = empresaId;
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

async buscarListaempresas(){
  var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
  prefeituraFilter.nome = "";
  prefeituraFilter.itemsPorPagina = 1000000;
  prefeituraFilter.pagina = 1;
  await this.apiEmpresa.BuscarTodasEmpresas(prefeituraFilter)
  .then((result) => {
    this.listaEmpresa = result.data;
  })
  .catch(() => {
    this.isLoading = false;
  });
}


async salvar(){
  this.isLoading = true;

  this.atualizarContrato.DataContrato = (this.dataContratoString);
  this.atualizarContrato.DataInicio = (this.dataInicioString);
  this.atualizarContrato.DataTerminoAtualizada = (this.dataTerminoAtualizadaString);
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
    this._toastService.mensagemSuccess("Contrato editado com sucesso");
    this.dialogRef.close(result);
  })
  .catch((res) => {
    this._toastService.mensagemError(res.error.message);
  })
  .finally(() => {
    this.isLoading = false;
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

  async adicionarDocumento(){
    if(this.documentoInput.nativeElement.files[0] != undefined){
      var id = this.data.idContrato;
      const documentoFile = this.documentoInput.nativeElement.files[0] as File;
      let documentoRequest: salvarDocumentoContratoRequest = new salvarDocumentoContratoRequest();
      documentoRequest.IdContrato = id,
      documentoRequest.Arquivos = [documentoFile];
      /*this.listaDocumentoContrato.push({
        //a: documentoFile.name,
        //file: documentoFile
      });   
      this.documentoInput.nativeElement.value = '';
    }*/
      this.documentoInput.nativeElement.value = '';
      this.isLoading = true;
      // Filtra os documentos, removendo o que for igual ao item a ser deletado
      await this.api.AdicionarDocumentosContrato(documentoRequest)
      .then(async (result) => {
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

 /* deletarDocumentos(deletarDocumento: ListaDocumentosContrato): void {
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    this.listaDocumentoContrato = this.listaDocumentoContrato.filter(item => item !== deletarDocumento);
  }*/
  
  async deletarDocumento(idDocumento: number) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.api.DeletarArquivoContrato(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Documento deletado com sucesso.");
      this.data.arquivosContratos = this.data.arquivosContratos.filter(x => x.id != idDocumento);
    })
    .catch(() =>
    {
      this._toastService.mensagemSuccess("Erro ao deletar documento.");
    })
    .finally(()=>{
      this.isLoading = false;
    });
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

  async downloadDocumento(idDocumento: number, arquivo:string) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.api.DownloadArquivoContrato(idDocumento)
    .then((result) => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo;  // Você pode definir o nome do arquivo
      a.click();
      window.URL.revokeObjectURL(url);  // Limpar a URL após o download
      this._toastService.mensagemSuccess("Download realizado com sucesso.");
    })
    .catch((erro) =>
    {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }

}
