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

@Component({
  selector: 'app-tabela-perfis',
  templateUrl: './tabela-perfis.component.html',
  styleUrls: ['./tabela-perfis.component.scss']
})
export class TabelaPerfisComponent implements OnInit {
  listaPerfis: UsuariosResponse[] = [];
  displayedColumns: string[] = ['login', 'nome', 'cliente', 'acoes'];

  dataSource = new MatTableDataSource<UsuariosResponse>(this.listaPerfis);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    public _usuarioControllerService: UsuariosService,
    private _toastService: ToastService
  ){}

  ngOnInit(): void {
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
      this.dataSource.data = this.listaPerfis;
    })
    .catch((erro) => {
      this._toastService.mensagemError('Erro ao buscar usuários!');
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
      data: { edicao, id }
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
