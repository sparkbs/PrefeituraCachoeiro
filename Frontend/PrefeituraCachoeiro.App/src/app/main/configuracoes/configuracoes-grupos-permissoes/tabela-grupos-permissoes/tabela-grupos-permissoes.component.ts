import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditarCriarGruposPermissoesComponent } from '../editar-criar-grupos-permissoes/editar-criar-grupos-permissoes.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { GruposService } from 'src/app/services/grupos.service';
import { GruposRequest } from 'src/app/request/GruposRequest/gruposRequest';
import { Grupo } from 'src/app/response/grupoResponse/todosGruposResponse';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tabela-grupos-permissoes',
  templateUrl: './tabela-grupos-permissoes.component.html',
  styleUrls: ['./tabela-grupos-permissoes.component.scss']
})
export class TabelaGruposPermissoesComponent implements OnInit {
  listaGrupos: Grupo[] =[];
  displayedColumns: string[] = ['nome', 'permissoes', 'acoes'];
  dataSource = new MatTableDataSource<Grupo>(this.listaGrupos);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public dialog: MatDialog,
    public _gruposControllerService: GruposService,
    private _toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups() {
      var grupo: GruposRequest = {
        pagina: 1,
        itemsPorPagina: 10000
      };
      this._gruposControllerService.BuscarTodosGrupos(grupo)
      .then((res) => {
        this.listaGrupos = res.data;
        this.dataSource.data = this.listaGrupos;
      })
      .catch((erro) => {
        this._toastService.mensagemError("Erro ao buscar grupos!");
      })
  }

  getPermissoes(grupo: Grupo): string {
    return grupo.permissoes.map(p => p.tipoPermissao.nome).join(', ');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditarCriar(edicao: boolean = false, id?: number) {
    if (edicao) {
        return;
    }
    const dialogRef = this.dialog.open(EditarCriarGruposPermissoesComponent, {
          width: window.innerWidth >= 1450 ? '50%' : '50%',
          data: { edicao, id }
        });
    
        dialogRef.afterClosed().subscribe((res) => {
          if(res) {
            this.getAllGroups();
          }
        });
  }

  removeGroup(id: number) {
    
  }
}
