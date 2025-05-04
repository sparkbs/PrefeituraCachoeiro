import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { ConfirmaExclusaoComponent } from 'src/app/shared/confirma-exclusao/confirma-exclusao.component';
import { Editar_criar_empresaComponent } from '../editar_criar_empresa/editar_criar_empresa.component';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpresaFilter } from 'src/app/response/empresaResponse/empresaResponse';
import { EmpresaResponse } from 'src/app/response/contratosResponse/todosContratosResponse';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  lista: EmpresaResponse[] = [];
  displayedColumns: string[] = ['empresaId', 'nome', 'cnpj', 'email','logo','acoes'];
  
  dataSource: MatTableDataSource<EmpresaResponse>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly api: EmpresaService
  ) { 
    this.dataSource = new MatTableDataSource(this.lista);    
  }

  async ngOnInit() {
    await this.buscarListaEmpresas();
  }

  formatarCNPJ(cnpj: string): string {
    if(cnpj){
    cnpj = cnpj.replace(/\D/g, '');
  
    cnpj = cnpj.substring(0, 14);
  
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, '$1.$2.$3/$4-$5');
    }
    else{
      return '';
    }
  }

  async buscarListaEmpresas(){
    var prefeituraFilter : EmpresaFilter = new EmpresaFilter();
    prefeituraFilter.nome = "";
    prefeituraFilter.itemsPorPagina = 1000000;
    prefeituraFilter.pagina = 1;
    await this.api.BuscarTodasEmpresas(prefeituraFilter)
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

  async deleteEmpresa(id: number){
    const dialogRef = this.dialog.open(ConfirmaExclusaoComponent);
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        await this.api.DeletarEmpresa(id)
        .then((result) => {
          var index = this.lista.findIndex(item => item.empresaId == id);
          this.lista.splice(index, 1);
      
          this.dataSource.data = this.lista;
        });
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(Editar_criar_empresaComponent);

    dialogRef.afterClosed().subscribe(async result => {
      await this.buscarListaEmpresas();
    });

  }

  async editEmpresa(row: EmpresaResponse){
    const dialogRef = this.dialog.open(Editar_criar_empresaComponent,{
      data: row
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.buscarListaEmpresas();
    });
  }

}
