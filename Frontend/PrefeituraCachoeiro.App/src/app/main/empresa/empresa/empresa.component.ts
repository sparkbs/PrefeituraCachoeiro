import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { PrefeituraDataResponse, PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { ConfirmaExclusaoComponent } from 'src/app/shared/confirma-exclusao/confirma-exclusao.component';
import { Editar_criar_empresaComponent } from '../editar_criar_empresa/editar_criar_empresa.component';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  lista: PrefeituraResponse[] = [];
  displayedColumns: string[] = ['idPrefeitura', 'nome', 'logo','acoes'];
  
  dataSource: MatTableDataSource<PrefeituraResponse>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly api: PrefeituraService
  ) { 
    this.dataSource = new MatTableDataSource(this.lista);    
  }

  async ngOnInit() {
    await this.buscarListaPrefeituras();
  }

  async buscarListaPrefeituras(){
    var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
    prefeituraFilter.nome = "";
    prefeituraFilter.itemsPorPagina = 1000000;
    prefeituraFilter.pagina = 1;
    await this.api.BuscarTodasPrefeituras(prefeituraFilter)
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

  async deletePrefeitura(id: number){
    const dialogRef = this.dialog.open(ConfirmaExclusaoComponent);
    
    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        await this.api.DeletarPrefeitura(id)
        .then((result) => {
          var index = this.lista.findIndex(item => item.idPrefeitura == id);
          this.lista.splice(index, 1);
      
          this.dataSource.data = this.lista;
        });
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(Editar_criar_empresaComponent);

    dialogRef.afterClosed().subscribe(async result => {
      await this.buscarListaPrefeituras();
    });

  }

  async editPrefeitura(row: PrefeituraResponse){
    const dialogRef = this.dialog.open(Editar_criar_empresaComponent,{
      data: row
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.buscarListaPrefeituras();
    });
  }

}
