import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GruposRequest } from 'src/app/request/GruposRequest/gruposRequest';
import { PermissoesRequest } from 'src/app/request/PermissoesRequest/permissoesRequest';
import { TipoPermissaoResponse } from 'src/app/response/tipoPermissaoResponse/tipoPermissaoResponse';
import { GruposService } from 'src/app/services/grupos.service';
import { PermissaoService } from 'src/app/services/permissao.service';
import { TiposPermissoesService } from 'src/app/services/tiposPermissoes';
import { ToastService } from 'src/app/services/toast.service';

interface TipoPermissao {
  idTipoPermissao: number;
  nome: string;
}

@Component({
  selector: 'app-editar-criar-grupos-permissoes',
  templateUrl: './editar-criar-grupos-permissoes.component.html',
  styleUrls: ['./editar-criar-grupos-permissoes.component.scss']
})
export class EditarCriarGruposPermissoesComponent implements OnInit {
  form: FormGroup;
  listaTiposPermissoes: TipoPermissaoResponse[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarCriarGruposPermissoesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean, idGrupo: number },
    private fb: FormBuilder,
    public _tiposPermissoesControllerService: TiposPermissoesService,
    public _gruposControllerService: GruposService,
    public _permissaoControllerService: PermissaoService,
    private _toastService: ToastService
  ){}

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getAllPermissions();
    
    this.listaTiposPermissoes.forEach(permissao => {
      this.permissoesFormArray.push(this.createPermissaoControl(permissao));
    });
  }

  createForm() {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      permissoes: this.fb.array([], [this.requireAtLeastOneCheckbox()])
    });

    if(this.data.edicao) {
      
    }
  }

  async getAllPermissions() {
    await this._tiposPermissoesControllerService.BuscarTodasTiposPermissoes()
    .then((res) => {
      this.listaTiposPermissoes = res;
    })
    .catch((err) => {

    });
  }

  private createPermissaoControl(permissao: TipoPermissao) {
    return this.fb.group({
      idTipoPermissao: permissao.idTipoPermissao,
      nome: permissao.nome,
      selecionado: new FormControl(false)
    });
  }

  get permissoesFormArray() {
    return this.form.get('permissoes') as FormArray;
  }

  private requireAtLeastOneCheckbox() {
    return (control: FormArray) => {
      return control.controls.some(ctrl => ctrl.value.selecionado) ? null : { required: true };
    };
  }

  saveForm() {
    if(!this.data.edicao) {
      const formValues = this.form.value;
      const permissoesSelecionadas = formValues.permissoes.filter(res => res.selecionado);

      if (formValues.nome == "" || permissoesSelecionadas.length == 0) {
        this._toastService.messageWarning("Grupo e permissão devem ser preenchidos!");
        return;
      }

      this._gruposControllerService.CriarGrupos(formValues.nome)
      .then((res) => {
        permissoesSelecionadas.forEach((resPermissao) => {
          const permissaoRequest: PermissoesRequest = {
            tipoPermissaoId: resPermissao.idTipoPermissao,
            grupoId: res.idGrupo
          };

          this._permissaoControllerService.CriarPermissoes(permissaoRequest)
          .then((resPermissaoRetorno) => {
          })
          .catch((erro) => {
            this._toastService.mensagemError(erro.error.message);
          });
        });

        this._toastService.mensagemSuccess("Grupo criado com sucesso!");
        this.dialogRef.close(true);
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      });
    }
  }
}
