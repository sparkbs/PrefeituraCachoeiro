import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { ToastService } from 'src/app/services/toast.service';
import { AtualizarUsuariosRequest, CriarUsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { GruposService } from 'src/app/services/grupos.service';
import { GruposRequest } from 'src/app/request/GruposRequest/gruposRequest';
import { PrefeituraResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { Grupo } from 'src/app/response/grupoResponse/todosGruposResponse';
import { UsuariosGruposService } from 'src/app/services/usuariosGrupos.service';
import { UsuariosGruposRequest } from 'src/app/request/UsuariosGruposRequest/usuariosGruposRequest';

@Component({
  selector: 'app-editar-criar-perfis',
  templateUrl: './editar-criar-perfis.component.html',
  styleUrls: ['./editar-criar-perfis.component.scss']
})
export class EditarCriarPerfisComponent implements OnInit {
  usuarioEdit: UsuariosResponse = new UsuariosResponse();
  listaPrefeitura: PrefeituraResponse[] = [];
  listaGrupos: Grupo[] =[];
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarCriarPerfisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean, id: number },
    private fb: FormBuilder,
    public _usuarioControllerService: UsuariosService,
    public _gruposControllerService: GruposService,
    private _toastService: ToastService,
    public _prefeituraControllerService: PrefeituraService,
    public _UsuariosGruposControllerService: UsuariosGruposService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllGroups();
    this.buscarListaPrefeituras();

    if (this.data.edicao && this.data.id) {
      this.getUserById(this.data.id);
    }
    else {
      this.form.get('senha')?.enable();
    }
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  createForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      prefeitura: [0],
      grupo: [0, [Validators.required]]
    });
  }

  async buscarListaPrefeituras(){
        var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
        prefeituraFilter.nome = "";
        prefeituraFilter.itemsPorPagina = 1000000;
        prefeituraFilter.pagina = 1;
        await this._prefeituraControllerService.BuscarTodasPrefeituras(prefeituraFilter)
        .then((result) => {
          this.listaPrefeitura = result.data;
        });
  }

  getAllGroups() {
    var grupo: GruposRequest = {
      pagina: 1,
      itemsPorPagina: 10000
    };
    this._gruposControllerService.BuscarTodosGrupos(grupo)
    .then((res) => {
      this.listaGrupos = res.data;
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
  }

  async getUserById(id: number) {
    this._usuarioControllerService.BuscarUsuario(id)
    .then((res) => {
      this.usuarioEdit = res;
      this.completeProfile();
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    });
  }

  completeProfile() {
    this.form.get('nome').setValue(this.usuarioEdit.nome);
    this.form.get('email').setValue(this.usuarioEdit.login);
    this.form.get('prefeitura').setValue(this.usuarioEdit.prefeituraId);
    this.form.get('grupo')?.disable();
  }

  saveForm() {
    if (!this.data.edicao) {
      var usuarioRequest: CriarUsuariosRequest = {
        login: this.form.get('email').value,
        nome: this.form.get('nome').value,
        senha: this.form.get('senha').value,
        prefeituraId: this.form.get('prefeitura').value ? this.form.get('prefeitura').value : undefined
      };

      if(!this.isEmailValid(usuarioRequest.login))
      {
        this._toastService.mensagemError("Email invalido");
      }
      else
      {
        this._usuarioControllerService.CriarUsuarios(usuarioRequest)
        .then((res) => {
          var usuarioGrupoRequest: UsuariosGruposRequest = {
            usuarioId: res.idUsuario,
            grupoId: this.form.get('grupo').value
          };

          this._UsuariosGruposControllerService.InserirUsuariosGrupos(usuarioGrupoRequest)
          .then((res) => {

          })
          .catch((erro) => {
            this._toastService.mensagemError(erro.error.message);
          });
          this._toastService.mensagemSuccess("Perfil criado com sucesso!");
          this.dialogRef.close(true);
        })
        .catch((erro) => {
          this._toastService.mensagemError(erro.error.message);
        });
      }
    }
    else {
      var usuarioUpdateRequest: AtualizarUsuariosRequest = {
        id: this.usuarioEdit.idUsuario,
        login: this.form.get('email').value,
        nome: this.form.get('nome').value,
        senha: this.form.get('senha').value,
        prefeituraId: this.form.get('prefeitura').value
      };

      if(!this.isEmailValid(usuarioUpdateRequest.login))
      {
        this._toastService.mensagemError("Email invalido");
      }
      else{
        this._usuarioControllerService.AtualizarUsuarios(usuarioUpdateRequest)
        .then((res) => {
          this._toastService.mensagemSuccess("Perfil atualizado com sucesso!");
          this.dialogRef.close(true);
        })
        .catch((erro) => {
          this._toastService.mensagemError(erro.error.message);
        });
      }
    }
  }
}
