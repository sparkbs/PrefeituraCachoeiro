import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InserirMedicao } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { PermissoesRequest } from 'src/app/request/PermissoesRequest/permissoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { Contrato, MedicoesResponse, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { PermissaoService } from 'src/app/services/permissao.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-cadastrarMedicao',
  templateUrl: './cadastrarMedicao.component.html',
  styleUrls: ['./cadastrarMedicao.component.scss']
})
export class CadastrarMedicaoComponent implements OnInit {
  projetoSelecionado = 0;
  nomeMedicao = 0;
  listaProjetos: ProjetoResponse[] = [];
  disabledNomeMedicao = false;
  isLoading = false;
  secretaria = "";
  projetoMedicao = "";
  resumo = "";
  listaFiltrada: any[] = [];
  selectedProjeto: number | null = null; // Valor selecionado

  constructor(private readonly api: MedicoesService,
    @Inject(MAT_DIALOG_DATA) public data: {medicoes: Contrato, numeroMedicao?:
      number, projetosMedidos: MedicoesResponse[], associarMedicao: boolean },
     public _projetoControllerService: ProjetoService,
     private _toastService: ToastService,
     public dialogRef: MatDialogRef<CadastrarMedicaoComponent> // Referência ao diálogo
    )
  {
    if(data.numeroMedicao != null || data.numeroMedicao != undefined){
      this.nomeMedicao = data.numeroMedicao;
      if(data.associarMedicao){
        this.secretaria = data.projetosMedidos[0].secretaria;
        this.projetoMedicao = data.projetosMedidos[0].periodoMedicao;
        this.resumo = data.projetosMedidos[0].resumo;
      }
      this.disabledNomeMedicao = true;
    }
  }

  async ngOnInit() {
    this.isLoading = true;
    await this.getAllProjects()
  }

  voltarTelaCriarMedicaoOuProjeto(){
    this.dialogRef.close();
  }

  async criarNovaMedicao(){
    this.isLoading = true;

    let medicaoRequest = new InserirMedicao();
    this.data.medicoes.items.forEach(x => {
      x.idContrato = this.data.medicoes.idContrato;
    });

    medicaoRequest.dataMedicao = new Date();
    medicaoRequest.idContrato = this.data.medicoes.idContrato;
    medicaoRequest.idProjeto = this.projetoSelecionado;
    medicaoRequest.secretaria = this.secretaria;
    medicaoRequest.periodoMedicao = this.projetoMedicao;
    medicaoRequest.resumo = this.resumo;

    medicaoRequest.items = this.data.medicoes.items.map(item => ({
      idItemContrato: item.idItemContrato,
      unidade: 0
    }));
    medicaoRequest.numeroMedicao = this.nomeMedicao;
    if(this.data?.projetosMedidos != null && this.data?.projetosMedidos != undefined && this.data.projetosMedidos.some(x => x.idProjeto == this.projetoSelecionado)){
      this.isLoading = false;
      this._toastService.mensagemError("Projeto ja existe nessa medição");
      this.dialogRef.close();
    }
    else{
      await this.api.CriarMedicoes(medicaoRequest)
      .then((result) => {
        this._toastService.mensagemSuccess("Medição criada com sucesso.");
        this.dialogRef.close(result.idMedicoesProjeto);
      })
      .catch((err) =>
      {
        this._toastService.mensagemError(err.error.message);
        this.isLoading = false;
      });
    }
  }

  filtrarProjeto(valor: string) {
    // Filtra a lista com base no valor digitado
    this.listaFiltrada = this.listaProjetos.filter(projeto => 
      projeto.nomeProjeto.toLowerCase().includes(valor.toLowerCase())
    );
  }

  async getAllProjects() {
    const projetoRequest: ProjetoRequest = {
      nome: '',
      itemsPorPagina: 1000000,
      pagina: 1,
      idContrato: this.data.medicoes.idContrato
    };

    try {
      await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
      .then((res) => {
        if(this.data.associarMedicao){
          this.listaProjetos = res.data.filter(item => 
            !this.data.projetosMedidos.some(projeto => projeto.idProjeto === item.idProjeto)
          );
        }
        else{
          this.listaProjetos = res.data;
        }
        this.listaFiltrada = [...this.listaProjetos];
      });

    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
    finally{
      this.isLoading = false;
    }
  }

  async onSelectionProjetoChange(nome: string){
    var projetoId = this.listaProjetos.find(x => x.nomeProjeto === nome).idProjeto;
    this.projetoSelecionado = projetoId;
  }
}
