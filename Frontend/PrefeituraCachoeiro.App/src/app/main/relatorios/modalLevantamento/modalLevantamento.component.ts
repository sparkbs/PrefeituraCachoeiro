import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { MedicaoLevantamento, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';

export class TabelaLevantamento {
  idItem: number;
  nome: string;
  medicoes: MedicaoLevantamento[] = [];
}

@Component({
  selector: 'app-modalLevantamento',
  templateUrl: './modalLevantamento.component.html',
  styleUrls: ['./modalLevantamento.component.scss']
})
export class ModalLevantamentoComponent implements OnInit {
  dadosTabela: TabelaLevantamento[] = [];
  maxMedicoes: number;
  displayedColumns: string[] = [];
  form: FormGroup;
  listaProjetos: ProjetoResponse[] = [];
  listaMedicoes: MedicoesResponse[] = [];

  dataSource = new MatTableDataSource<TabelaLevantamento>(this.dadosTabela);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { idProjeto: number, idContrato: number },
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService,
    private _medicaoControllerService: MedicoesService
  ) { }

  ngOnInit() {
    this.createForm();
    this.buscarProjetos();
    this.dataSource.paginator = this.paginator;
  }

  createForm() {
    this.form = this.fb.group({
      projetoId: [{ value: 0}, Validators.required],
    });
  }

  construirTabela() {

  }

  async buscarProjetos() {
      const projetoRequest: ProjetoRequest = {
            nome: '',
            pagina: 1,
            itemsPorPagina: 10000
      };

      await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
      .then((res) => {
        this.listaProjetos = res.data;
      })
      .catch((erro) => {
        console.error(erro);
        this._toastService.mensagemError('Erro ao buscar projetos!');
      });
  }

  async buscarMedicao(projetoId: number, contratoId: number) {
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idProjeto = projetoId;
    medicoesRequest.idContrato = contratoId;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;

    this._medicaoControllerService.BuscarTodasMedicoes(medicoesRequest)
    .then((res) => {
      debugger
      this.listaMedicoes = res.data;

      if (this.listaMedicoes.length != 0) {
        let dadoTabela: TabelaLevantamento;
        this.listaMedicoes.forEach((res) => {
          res.items.forEach((resItem) => {
            // criar if verificando index de id de item existente dentro do array dadosTabela, se caso existir realizar o processo abaixo, se não criar um else para apenas adicionar medicaoLevantamento no index em questão
            const index = this.dadosTabela.findIndex(resIndex => resIndex.idItem == resItem.itemsContrato.itemId);
            if (index !== -1) {
              let medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
              medicaoLevantamento.qtdItem = resItem.itemsContrato.quantidadeId;
              medicaoLevantamento.valorTotalComBdi = resItem.itemsContrato.valorComBdi * resItem.itemsContrato.quantidadeId;
              this.dadosTabela[index].medicoes.push(medicaoLevantamento);
            }
            else {
              dadoTabela = new TabelaLevantamento();

              let medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
              medicaoLevantamento.qtdItem = resItem.itemsContrato.quantidadeId;
              medicaoLevantamento.valorTotalComBdi = resItem.itemsContrato.valorComBdi * resItem.itemsContrato.quantidadeId;

              dadoTabela.idItem = resItem.itemsContrato.itemId
              dadoTabela.nome = resItem.itemsContrato.item.descricao
              dadoTabela.medicoes.push(medicaoLevantamento);

              this.dadosTabela.push(dadoTabela);
            }
          });
        });
        debugger
        console.log(this.dadosTabela);

        this.maxMedicoes = Math.max(...this.dadosTabela.map(item => item.medicoes.length));
        this.displayedColumns = ['nome', ...Array.from({ length: this.maxMedicoes }, (_, i) => `medicao${i + 1}`)];
        this.dataSource.data = this.dadosTabela;
      }
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar medições!');
    });
  }

  async buscarMedicoesProjeto(){
    const projetoId: number = this.form.get('projetoId').value;
    if (projetoId) {
      const projetoSelecionado = this.listaProjetos.find(res => res.idProjeto == projetoId);

      this.buscarMedicao(projetoId, projetoSelecionado.contratos[0].idContrato);
    }
    else {
      this._toastService.messageWarning("Um projeto deve ser selecionado!");
    }
  }

}
