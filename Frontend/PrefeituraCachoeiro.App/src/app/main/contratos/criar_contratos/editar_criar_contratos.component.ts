import { AfterViewInit, Component, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../contratos.component';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { CriarContratoRequest } from 'src/app/request/ContratoRequest/criarContratoRequest';
import { ContratosService } from 'src/app/services/contratos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar_criar_contratos',
  templateUrl: './editar_criar_contratos.component.html',
  styleUrls: ['./editar_criar_contratos.component.scss']
})
export class Editar_criar_contratosComponent implements OnInit {
  @ViewChild('documentoInput') documentoInput: any;
  @ViewChild('baseDadosInput') baseDadosInput: any;

  listaPrefeitura: PrefeituraResponse[] = [];
  listaGerentes: UsuariosResponse[] = [];
  criarContrato: CriarContratoRequest = new CriarContratoRequest();
  listaDocumentoContrato: ListaDocumentosContrato[] = [];
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: Item, 
  private dialogRef: MatDialogRef<Editar_criar_contratosComponent>,
  private readonly apiPrefeitura: PrefeituraService,
  private readonly api: ContratosService,
  private readonly apiUsuarios: UsuariosService,
  private _toastService: ToastService
) { 
  }

  async ngOnInit() {
    await this.buscarListaGerentes();
    await this.buscarListaPrefeituras();
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

  async salvar(){
    this.criarContrato.EmpresaId = 1;
    this.criarContrato.Valor = this.criarContrato.Valor.replaceAll(".","").replaceAll("R$","").replaceAll(",",".");
    this.criarContrato.ArquivoTemplate = this.adicionarBaseDados();

    let documentoContrato: File[] = [];
    this.listaDocumentoContrato.forEach(x => documentoContrato.push(x.file));

    this.criarContrato.Arquivos = documentoContrato;
    this._toastService.mensagemSuccess("Iniciando processo de criar o contrato");
    await this.api.CriarContrato(this.criarContrato)
    .then((result) => {
      this._toastService.mensagemSuccess("Contrato criado com sucesso");
      this.dialogRef.close(result);
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao cadastrar contrato");
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
      this.criarContrato.Valor = ''; // Ou você pode definir um valor padrão
      return;
    }
    value = (parseInt(value) || 0).toString(); 
    value = value.padStart(3, '0'); 
    value = value.slice(0, -2) + ',' + value.slice(-2); 
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    value = 'R$ ' + value; 
    this.criarContrato.Valor = value; 
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
}
