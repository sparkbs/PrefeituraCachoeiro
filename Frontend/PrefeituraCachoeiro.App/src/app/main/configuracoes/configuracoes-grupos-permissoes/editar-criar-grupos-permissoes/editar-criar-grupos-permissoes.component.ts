import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupPermission, ModulesPermission } from '../tabela-grupos-permissoes/tabela-grupos-permissoes.component';

@Component({
  selector: 'app-editar-criar-grupos-permissoes',
  templateUrl: './editar-criar-grupos-permissoes.component.html',
  styleUrls: ['./editar-criar-grupos-permissoes.component.scss']
})
export class EditarCriarGruposPermissoesComponent implements OnInit {
  form: FormGroup;
  panelOpenState = false;
  listGroupPermission: GroupPermission = new GroupPermission();

  modules: ModulesPermission[] = [
    { nameModule: 'Perfil', access: false },
    { nameModule: 'Projeto', access: false },
    { nameModule: 'Contrato', access: false },
    { nameModule: 'Prefeitura', access: false },
    { nameModule: 'Medição', access: false }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditarCriarGruposPermissoesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean, groupPermission: GroupPermission },
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupName: ['', [Validators.required]],
      permissions: this.fb.array(
        this.modules.map(module =>
          this.fb.group({
            nameModule: [module.nameModule],
            access: [module.access]
          })
        )
      )
    });

    if(this.data.edicao) {
      this.form.get('groupName').setValue(this.data.groupPermission.nameGroup);
      this.form.get('permissions').setValue(this.data.groupPermission.modules);
    }
  }

  saveForm() {
    if (this.form.invalid) {
      return;
    }
    const selectedPermissions: ModulesPermission[] = this.form.value.permissions.map(module => ({
      nameModule: module.nameModule,
      access: module.access
    }));

    this.listGroupPermission.id = this.data.groupPermission.id;
    this.listGroupPermission.nameGroup = this.form.get('groupName').value;
    this.listGroupPermission.modules.push(...selectedPermissions);

    this.dialogRef.close(this.listGroupPermission);
  }
}
