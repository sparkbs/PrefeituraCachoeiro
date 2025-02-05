import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AditivosContratoRequest } from 'src/app/request/ContratoRequest/aditivosContratoRequest';
import { BuscarAditivosContrato } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { CriarContratoRequest } from 'src/app/request/ContratoRequest/criarContratoRequest';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-aditivos-contratos',
  templateUrl: './aditivos-contratos.component.html',
  styleUrls: ['./aditivos-contratos.component.scss']
})
export class AditivosContratosComponent implements AfterViewInit {
  lista: ContratosResponse[] = [];
  displayedColumns: string[] = ['tipoAditivo', 'dataAssinatura', 'validadeAditivo','acoes'];
  dataSource: MatTableDataSource<ContratosResponse>;
  valorAditivo: string;
  contratoBase: ContratosResponse;
  requestCriarAditivo: AditivosContratoRequest = new AditivosContratoRequest();
  @ViewChild('baseDadosInput') baseDadosInput: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private readonly api: ContratosService, private _toastService: ToastService,   private dialogRef: MatDialogRef<AditivosContratosComponent>, ) {
    this.dataSource = new MatTableDataSource(this.lista); 
  }

  async ngAfterViewInit() {
    this.contratoBase = this.data.contratobase;
    console.log(this.data);
    var aditivoFilter : BuscarAditivosContrato = new BuscarAditivosContrato();
    aditivoFilter.idContrato = this.data.contratobase.idContrato;
    await this.api.BuscarTodosAditivos(aditivoFilter)
    .then((result) => {
      this.lista = result;
      this.dataSource.data = (this.lista);         
      console.log(this.dataSource.data);
      console.log(result);
    });
  }

  async criarAditivo(){
   /* this.requestCriarAditivo.TipoAditivo = this.contratoBase.dataTermino;
    this.requestCriarAditivo.DataValidadeAditivo = this.contratoBase.dataInicio;
    this.requestCriarAditivo.DataAssinaturaAditivo = this.contratoBase.dataContrato;*/
    this.requestCriarAditivo.ContratoId = this.contratoBase.idContrato;
    this.requestCriarAditivo.ArquivoTemplate = this.adicionarBaseDados();
    this._toastService.mensagemSuccess("Processamento iniciado!");

    await this.api.CriarAditivos(this.requestCriarAditivo)
    .then((result) => {
      this._toastService.mensagemSuccess("Aditivo criado com sucesso");
      this.dialogRef.close(result);
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao cadastrar aditivo");
    });

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

  async deletarAditivo(id: number){
    await this.api.DeletarContrato(id)  
    .then((result) => {
      var index = this.lista.findIndex(item => item.idContrato == id);
      this.lista.splice(index, 1);
  
      this.dataSource.data = this.lista;
    });
  }

}
