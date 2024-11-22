import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditarCriarGruposPermissoesComponent } from '../editar-criar-grupos-permissoes/editar-criar-grupos-permissoes.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

export interface tableGroupPermission {
  id: number;
  grupo: string;
  perfil?: boolean;
  projeto?: boolean;
  contrato?: boolean;
  prefeitura?: boolean;
  medicao?: boolean;
  acoes: string;
}

export class GroupPermission {
  id: number;
  nameGroup: string;
  modules: Array<ModulesPermission>;

  constructor(){
    this.nameGroup = '';
    this.modules = [];
  }
}

export class ModulesPermission {
  nameModule: string;
  access?: boolean;
}

@Component({
  selector: 'app-tabela-grupos-permissoes',
  templateUrl: './tabela-grupos-permissoes.component.html',
  styleUrls: ['./tabela-grupos-permissoes.component.scss']
})
export class TabelaGruposPermissoesComponent {
  listTableGroupPermission: tableGroupPermission[] = [];
  displayedColumns: string[] = ['grupo', 'perfil', 'projeto', 'contrato', 'prefeitura', 'medicao', 'acoes'];
  dataSource = new MatTableDataSource<tableGroupPermission>(this.listTableGroupPermission);

  groupPermission: GroupPermission[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(public dialog: MatDialog) {
    this.mockPreencherGroupPermission();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  mockPreencherGroupPermission() {
    const modulesAdmin: ModulesPermission[] = [
      { nameModule: 'Perfil', access: true },
      { nameModule: 'Projeto', access: true },
      { nameModule: 'Contrato', access: true },
      { nameModule: 'Prefeitura', access: true },
      { nameModule: 'Medição', access: true }
    ];

    const modulesGerente: ModulesPermission[] = [
      { nameModule: 'Perfil', access: false },
      { nameModule: 'Projeto', access: true },
      { nameModule: 'Contrato', access: true },
      { nameModule: 'Prefeitura', access: true },
      { nameModule: 'Medição', access: true }
    ];

    const modulesUser: ModulesPermission[] = [
      { nameModule: 'Perfil', access: false },
      { nameModule: 'Projeto', access: true },
      { nameModule: 'Contrato', access: false },
      { nameModule: 'Prefeitura', access: false},
      { nameModule: 'Medição', access: true }
    ];

    const groupPermissionAdmin: GroupPermission = {
      id: 1,
      nameGroup: 'Administrador',
      modules: modulesAdmin
    };

    const groupPermissionGerente: GroupPermission = {
      id: 2,
      nameGroup: 'Gerente',
      modules: modulesGerente
    };

    const groupPermissionUser: GroupPermission = {
      id: 3,
      nameGroup: 'Usuario',
      modules: modulesUser
    };

    this.groupPermission.push(groupPermissionAdmin);
    this.groupPermission.push(groupPermissionGerente);
    this.groupPermission.push(groupPermissionUser);

    this.groupPermission.forEach(res => {
      let tableGrouPermission: tableGroupPermission = {
        id: res.id,
        grupo: res.nameGroup,
        acoes: ''
      };

      res.modules.forEach(module => {
        switch(module.nameModule) {
          case 'Perfil':
            tableGrouPermission.perfil = module.access;
            break;
          case 'Projeto':
            tableGrouPermission.projeto = module.access;
            break;
          case 'Contrato':
            tableGrouPermission.contrato = module.access;
            break;
          case 'Prefeitura':
            tableGrouPermission.prefeitura = module.access
            break;
          case 'Medição':
            tableGrouPermission.medicao = module.access;
            break;
        }
      });

      this.listTableGroupPermission.push(tableGrouPermission);
    });
  }

  openEditarCriar(edicao: boolean = false, id?: number) {
    let groupPermission: GroupPermission = new GroupPermission();

    if (edicao) {
      groupPermission = this.groupPermission.find(res => res.id == id);
    }
    else {
      const ultimoDado: tableGroupPermission = this.listTableGroupPermission[this.listTableGroupPermission.length - 1];
      groupPermission.id = ultimoDado.id + 1;
    }

    const dialogRef = this.dialog.open(EditarCriarGruposPermissoesComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao, groupPermission }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listTableGroupPermission = this.listTableGroupPermission.filter(item => item.id !== result.id);
      this.groupPermission = this.groupPermission.filter(item => item.id !== result.id);
      this.dataSource = new MatTableDataSource();

      let tableGrouPermission: tableGroupPermission = {
        id: result.id,
        grupo: result.nameGroup,
        acoes: ''
      };

      result.modules.forEach(module => {
        switch(module.nameModule) {
          case 'Perfil':
            tableGrouPermission.perfil = module.access;
            break;
          case 'Projeto':
            tableGrouPermission.projeto = module.access;
            break;
          case 'Contrato':
            tableGrouPermission.contrato = module.access;
            break;
          case 'Prefeitura':
            tableGrouPermission.prefeitura = module.access
            break;
          case 'Medição':
            tableGrouPermission.medicao = module.access;
            break;
        }
      });

      this.groupPermission.push(result);
      this.listTableGroupPermission.push(tableGrouPermission);

      this.dataSource = new MatTableDataSource();
      this.dataSource = new MatTableDataSource(this.listTableGroupPermission);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  removeGroupPermission(id: number) {
    this.listTableGroupPermission = this.listTableGroupPermission.filter(item => item.id !== id);
    this.groupPermission = this.groupPermission.filter(item => item.id !== id);

    this.dataSource.data = this.listTableGroupPermission;
  }
}
