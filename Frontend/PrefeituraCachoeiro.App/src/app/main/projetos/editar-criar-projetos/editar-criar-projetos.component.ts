import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar-criar-projetos',
  templateUrl: './editar-criar-projetos.component.html',
  styleUrls: ['./editar-criar-projetos.component.scss']
})
export class EditarCriarProjetosComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  prefeituras: string[] = [
    'Cachoeiro',
    'BH',
    'Teste',
  ];

  contratos: string[] = [
    'Contrato 1',
    'Contrato 2',
    'Contrato 3',
  ];

  constructor(
    public dialogRef: MatDialogRef<EditarCriarProjetosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean },
    private fb: FormBuilder,
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService,
  ) {}

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      contrato: ['', [Validators.required]],
      prefeitura: ['', [Validators.required]]
    });
  }

  saveForm() {
    const projetoRequest: ProjetoRequest = {
      nome: this.form.get('nome').value
    };

    this._projetoControllerService.CriarProjeto(projetoRequest)
    .then((res) => {
      this._toastService.mensagemSuccess('Projeto salvo com sucesso!');
      this.dialogRef.close(true);
    })
    .catch((erro) => {
      this._toastService.mensagemError('Erro ao salvar o projeto');
    })
  }
}
