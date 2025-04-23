import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { VinculoProjetoContratoRequest } from 'src/app/request/ContratoRequest/vincularProjetoContrato';
import { AtualizarProjetoRequest, CriarProjetoRequest, ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ContratoModel, ContratosResponse, PrefeituraResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-editar-criar-projetos',
  templateUrl: './editar-criar-projetos.component.html',
  styleUrls: ['./editar-criar-projetos.component.scss']
})
export class EditarCriarProjetosComponent implements OnInit {
  form: FormGroup;
  projetoEdit: ProjetoResponse = new ProjetoResponse();
  listaPrefeitura: PrefeituraResponse[] = [];
  listaContratos: ContratosResponse[] = [];
  listaFiltrada: any[] = [];
  selectedPrefeitura: number | null = null; // Valor selecionado

  constructor(
    public dialogRef: MatDialogRef<EditarCriarProjetosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean, id: number },
    private fb: FormBuilder,
    public _projetoControllerService: ProjetoService,
    public _prefeituraControllerService: PrefeituraService,
    public _contratoControllerService: ContratosService,
    private _toastService: ToastService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.buscarListaPrefeituras();
    this.listaFiltrada = [...this.listaPrefeitura];

    if (this.data.edicao && this.data.id) {
      this.getProjectById(this.data.id);
    }
  }

  filtrarPrefeitura(valor: string) {
    // Filtra a lista com base no valor digitado
    this.listaFiltrada = this.listaPrefeitura.filter(prefeitura => 
      prefeitura.nome.toLowerCase().includes(valor.toLowerCase())
    );
  }

  createForm() {
    this.form = this.fb.group({
      nome: [{ value: '', disabled: true }, Validators.required],
      contrato: [{ value: 0, disabled: true }, Validators.required],
      prefeitura: ['', [Validators.required]],
      codigoProjeto: [{ value: 0, disabled: true }, Validators.required]
    });
  }

  async getProjectById(id: number) {
    await this._projetoControllerService.BuscarProjeto(id)
    .then(async (res) => {
      this.projetoEdit = res;
      await this.buscarListaContratos(this.projetoEdit.contratos[0].contratos.prefeituraId);
      this.completeForm();
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    });
  }

  completeForm() {
    var nomePrefeitura = this.listaPrefeitura.find(x => x.idPrefeitura == this.projetoEdit.contratos[0].contratos.prefeituraId).nome
    this.form.get('prefeitura').disable();
    this.form.get('nome').enable();
    this.form.get('nome').setValue(this.projetoEdit.nomeProjeto);
    this.form.get('contrato').setValue(this.projetoEdit.contratos[0].contratos.idContrato);
    this.form.get('prefeitura').setValue(nomePrefeitura);
    this.form.get('codigoProjeto').setValue(this.projetoEdit.codigoProjeto);
  }

  saveForm() {
    var nome = this.form.get('prefeitura').value;
    var prefeituraId = this.listaPrefeitura.find(x => x.nome == nome).idPrefeitura

    const projetoRequest: CriarProjetoRequest  = {
      nome: this.form.get('nome').value,
      codigoProjeto: this.form.get('codigoProjeto').value,
      idPrefeitura: prefeituraId
    };

    if (this.data.edicao && this.data.id) {
      let projetoUpdate: AtualizarProjetoRequest = {
        id: this.data.id,
        nome: this.form.get('nome').value,
        idPrefeitura: prefeituraId,
        codigoProjeto: this.form.get('codigoProjeto').value,
      }
      this._projetoControllerService.AtualizarProjeto(projetoUpdate)
      .then((res) => {
        this._toastService.mensagemSuccess('Projeto atualizado com sucesso!');
        this.dialogRef.close(true);
      })
      .catch((res) => {
        this._toastService.mensagemError(res.error.message);
      });
    }
    else {
      this._projetoControllerService.CriarProjeto(projetoRequest)
      .then((res) => {
        const vinculoProjContrato: VinculoProjetoContratoRequest = {
          idContrato: this.form.get('contrato').value,
          idProjeto: res.idProjeto
        };

        this._contratoControllerService.AdicionarProjetoContrato(vinculoProjContrato)
        .then((res) => {
          this._toastService.mensagemSuccess('Projeto salvo com sucesso!');
          this.dialogRef.close(true);
        })
        .catch((erro) => {
          this._projetoControllerService.DeletarProjeto(res.idProjeto);
          this._toastService.mensagemError(erro.error.message);
        });
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      })
    }
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
  
    async onSelectionChange(prefeituraNome: string){
      if (this.listaContratos.length != 0) {
        this.listaContratos = [];
        this.form.get('nome').setValue('');
        this.form.get('contrato').disable();
      }

      var prefeituraId = this.listaFiltrada.find(x => x.nome == prefeituraNome).idPrefeitura;
      this.form.get('contrato').enable();
      await this.buscarListaContratos(prefeituraId);
    }

    async onSelectionChangeContrato() {
      this.form.get('nome').enable();
      this.form.get('codigoProjeto').enable();
    }
  
    async buscarListaContratos(prefeituraId: number){
      var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
      contratosFilter.itemsPorPagina = 1000000;
      contratosFilter.IdProjeto = null;
      contratosFilter.pagina = 1;
      await this._contratoControllerService.BuscarTodosContratos(contratosFilter)
      .then((result) => {
        this.listaContratos = result.data.filter(x => x.prefeituraId == prefeituraId);
        if (this.listaContratos.length == 0) {
          this.form.get('nome').setValue('');
          this.form.get('nome').disable();
        }
      });
    }
}
