import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditarCriarPerfisComponent } from '../editar-criar-perfis/editar-criar-perfis.component';
import { MatSort } from '@angular/material/sort';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';

@Component({
  selector: 'app-tabela-perfis',
  templateUrl: './tabela-perfis.component.html',
  styleUrls: ['./tabela-perfis.component.scss']
})
export class TabelaPerfisComponent implements OnInit {
  listaPerfis: UsuariosResponse[] = [];
  listaPrefeituras: PrefeituraResponse[] =[];
  displayedColumns: string[] = ['login', 'nome', 'cliente', 'acoes'];

  dataSource = new MatTableDataSource<UsuariosResponse>(this.listaPerfis);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    public _usuarioControllerService: UsuariosService,
    public _prefeituraControllerService: PrefeituraService,
    private _toastService: ToastService
  ){}

  async ngOnInit(): Promise<void> {
    await this.buscarTodasPrefeituras();
    this.getAllUsers();
  }

  async getAllUsers() {
    var usuario: UsuariosRequest = {
      pagina: 1,
      itemsPorPagina: 10000
    };
    await this._usuarioControllerService.BuscarTodosUsuarios(usuario)
    .then((res) => {
      this.listaPerfis = res.data;

      this.listaPerfis.forEach(res => {
        this.listaPrefeituras.forEach(pf => {
          if (res.prefeituraId == pf.idPrefeitura) {
            res.nomePrefeitura = pf.nome;
          }
        })
      });

      this.dataSource.data = this.listaPerfis;
    })
    .catch((erro) => {
      this._toastService.mensagemError('Erro ao buscar usuários!');
    });
  }

  async buscarTodasPrefeituras() {
    const filter: PrefeituraFilter = {
      itemsPorPagina: 10000,
      pagina: 1,
      nome: ""
    };

    await this._prefeituraControllerService.BuscarTodasPrefeituras(filter)
    .then((res) => {
      this.listaPrefeituras = res.data;
    })
    .catch((error) => {
      this._toastService.mensagemError('Erro ao buscar prefeituras!');
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

  openEditarCriar(edicao: boolean = false, id?: number) {
    const dialogRef = this.dialog.open(EditarCriarPerfisComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao, id },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res) {
        this.getAllUsers();
      }
    });
  }

  removePerfil(id: number) {
    this._usuarioControllerService.DeletarUsuarios(id)
    .then((res) => {
      this.getAllUsers();
      this._toastService.mensagemSuccess("Sucesso ao deletar usuário!");
    })
    .catch((erro) => {
      this._toastService.mensagemError("Erro ao deletar usuário!");
    })
  }
}
