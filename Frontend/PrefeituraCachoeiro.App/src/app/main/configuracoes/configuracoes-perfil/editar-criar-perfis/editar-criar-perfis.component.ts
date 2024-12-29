import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TablePerfis } from '../tabela-perfis/tabela-perfis.component';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { ToastService } from 'src/app/services/toast.service';
import { CriarUsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { GruposService } from 'src/app/services/grupos.service';
import { GruposRequest } from 'src/app/request/GruposRequest/gruposRequest';

@Component({
  selector: 'app-editar-criar-perfis',
  templateUrl: './editar-criar-perfis.component.html',
  styleUrls: ['./editar-criar-perfis.component.scss']
})
export class EditarCriarPerfisComponent implements OnInit {
  usuarioEdit: UsuariosResponse = new UsuariosResponse();
  grupos: string[] = [
    'gerente',
    'usuario',
    'administrador'
  ];
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarCriarPerfisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean, id: number },
    private fb: FormBuilder,
    public _usuarioControllerService: UsuariosService,
    public _gruposControllerService: GruposService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllGroups();

    if (this.data.edicao && this.data.id) {
      this.getUserById(this.data.id);
    }
    else {
      this.form.get('senha')?.enable();
    }
  }

  createForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      grupo: ['', [Validators.required]]
    });
  }

  getAllGroups() {
    var grupo: GruposRequest = {
      pagina: 1,
      itemsPorPagina: 10000
    };
    this._gruposControllerService.BuscarTodosGrupos(grupo)
    .then((res) => {

    })
    .catch((erro) => {
      this._toastService.mensagemError("Erro ao buscar grupos!");
    })
  }

  async getUserById(id: number) {
    this._usuarioControllerService.BuscarUsuario(id)
    .then((res) => {
      this.usuarioEdit = res.data;
      this.completeProfile();
    })
    .catch((erro) => {
      this._toastService.mensagemError("Erro ao buscar perfil!");
    });
  }

  completeProfile() {
    this.form.get('nome').setValue(this.usuarioEdit.nome);
    this.form.get('email').setValue(this.usuarioEdit.login);
    this.form.get('grupo').setValue(this.usuarioEdit.grupo);
    this.form.get('senha')?.disable();
  }

  saveForm() {
    if (!this.data.edicao) {
      var usuarioRequest: CriarUsuariosRequest = {
        login: this.form.get('email').value,
        nome: this.form.get('nome').value,
        senha: this.form.get('senha').value
      };
      
      this._usuarioControllerService.CriarUsuarios(usuarioRequest)
      .then((res) => {
        this._toastService.mensagemSuccess("Perfil criado com sucesso!");
        this.dialogRef.close(true);
      })
      .catch((erro) => {
        this._toastService.mensagemError("Erro ao criar perfil!");
      });
    }
  }
}
