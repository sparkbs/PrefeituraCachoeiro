import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Editar_criar_contratosComponent } from './criar_contratos/editar_criar_contratos.component';
import { AditivosContratosComponent } from './aditivos-contratos/aditivos-contratos.component';
import { ContratosService } from 'src/app/services/contratos.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { Editar_contratosComponent } from './editar_contratos/editar_contratos/editar_contratos.component';

export interface Item {
  id:number;
  nomePrefeitura: string;
  dataInicioEFim: string;
  consorcio: string;
  gerente: string;
  valorContrato: number;
  tipoContratacao: string;
  acoes: string;
}

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements AfterViewInit, OnInit {
  readonly dialog = inject(MatDialog);

  /*lista: Item[] = [
    { id: 1,nomePrefeitura: 'Cachoeiro', dataInicioEFim: '25/03/2020 até 25/03/2022', consorcio: 'teste 1', gerente: 'João', valorContrato:20.000, tipoContratacao:'Adesão' ,acoes: ''},
    { id:2, nomePrefeitura: 'BH',  dataInicioEFim: '22/08/2020 até 25/08/2022', consorcio: 'teste 2', gerente: 'Maria', valorContrato:100.000, tipoContratacao:'Licitação',acoes: '' },
    { id: 3,nomePrefeitura: 'Teste',  dataInicioEFim: '25/03/2019 até 25/03/2021', consorcio: 'teste 3', gerente: 'Pedro', valorContrato:200.000, tipoContratacao:'Adesão',acoes: '' }
  ]*/
  lista: ContratosResponse[] = [];
  displayedColumns: string[] = ['numeroContrato','nomePrefeitura', 'dataInicio', 'dataTermino', 'gerente', 'valorSolicitado','valor','valorTotalMedido', 'valorSaldoRestante','tipoContratacao','acoes'];
  dataSource: MatTableDataSource<ContratosResponse>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly api: ContratosService) {
    this.dataSource = new MatTableDataSource(this.lista);    
  }

  async ngOnInit() {
    await this.buscarListaContratos();
  }

  async buscarListaContratos(){
    var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
    contratosFilter.itemsPorPagina = 1000000;
    contratosFilter.IdProjeto = null;
    contratosFilter.pagina = 1;
    await this.api.BuscarTodosContratos(contratosFilter)
    .then((result) => {
      this.lista = result.data;
      this.dataSource.data = (this.lista);         
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async deleteContrato(id: any){
    await this.api.DeletarContrato(id)  
    .then((result) => {
      var index = this.lista.findIndex(item => item.idContrato == id);
      this.lista.splice(index, 1);
  
      this.dataSource.data = this.lista;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(Editar_criar_contratosComponent);

    dialogRef.afterClosed().subscribe(async result => {
      await this.buscarListaContratos();
    });

  }

  async editContrato(row: Item){
    const dialogRef = this.dialog.open(Editar_contratosComponent,{
      data: row
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.buscarListaContratos();
    });
  }

  abrirAditivos(contratobase:ContratosResponse){
    const dialogRef = this.dialog.open(AditivosContratosComponent, {data:{contratobase}});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  formatCurrency(event: string): string { 
    let value = event.toString();
    value = value.replace(/\D/g, ''); 
    if (value === '') {
      return ''; // Ou você pode definir um valor padrão
    }
    value = (parseInt(value) || 0).toString(); 
    value = value.padStart(3, '0'); 
    value = value.slice(0, -2) + ',' + value.slice(-2); 
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    value = 'R$ ' + value; 
    return value; 
  }
}
