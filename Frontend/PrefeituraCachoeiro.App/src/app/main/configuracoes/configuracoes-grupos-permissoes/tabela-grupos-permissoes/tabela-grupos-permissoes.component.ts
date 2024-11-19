import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface tableGroupPermission {
  grupo: string;
  perfil?: boolean;
  projeto?: boolean;
  contrato?: boolean;
  prefeitura?: boolean;
  medicao?: boolean;
}

export class GroupPermission {
  nameGroup: string;
  modules: Array<ModulesPermission>;
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
  ELEMENT_DATA: tableGroupPermission[] = [];
  displayedColumns: string[] = ['grupo', 'perfil', 'projeto', 'contrato', 'prefeitura', 'medicao'];
  dataSource = new MatTableDataSource<tableGroupPermission>(this.ELEMENT_DATA);

  groupPermission: GroupPermission[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
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
    const listGroupPermission: GroupPermission[] = [];

    const modulesAdmin: ModulesPermission[] = [
      { nameModule: 'perfil', access: true },
      { nameModule: 'projeto', access: true },
      { nameModule: 'contrato', access: true },
      { nameModule: 'prefeitura', access: true },
      { nameModule: 'medicao', access: true }
    ];

    const modulesGerente: ModulesPermission[] = [
      { nameModule: 'perfil', access: false },
      { nameModule: 'projeto', access: true },
      { nameModule: 'contrato', access: true },
      { nameModule: 'prefeitura', access: true },
      { nameModule: 'medicao', access: true }
    ];

    const modulesUser: ModulesPermission[] = [
      { nameModule: 'perfil', access: false },
      { nameModule: 'projeto', access: true },
      { nameModule: 'contrato', access: false },
      { nameModule: 'prefeitura', access: false},
      { nameModule: 'medicao', access: true }
    ];

    const groupPermissionAdmin: GroupPermission = {
      nameGroup: 'Administrador',
      modules: modulesAdmin
    };

    const groupPermissionGerente: GroupPermission = {
      nameGroup: 'Gerente',
      modules: modulesGerente
    };

    const groupPermissionUser: GroupPermission = {
      nameGroup: 'Usuario',
      modules: modulesUser
    };

    listGroupPermission.push(groupPermissionAdmin);
    listGroupPermission.push(groupPermissionGerente);
    listGroupPermission.push(groupPermissionUser);

    listGroupPermission.forEach(res => {
      let tableGrouPermission: tableGroupPermission = {
        grupo: res.nameGroup
      };

      res.modules.forEach(module => {
        switch(module.nameModule) {
          case 'perfil':
            tableGrouPermission.perfil = module.access;
            break;
          case 'projeto':
            tableGrouPermission.projeto = module.access;
            break;
          case 'contrato':
            tableGrouPermission.contrato = module.access;
            break;
          case 'prefeitura':
            tableGrouPermission.prefeitura = module.access
            break;
          case 'medicao':
            tableGrouPermission.medicao = module.access;
            break;
        }
      });

      this.ELEMENT_DATA.push(tableGrouPermission);
    });
  }
}
