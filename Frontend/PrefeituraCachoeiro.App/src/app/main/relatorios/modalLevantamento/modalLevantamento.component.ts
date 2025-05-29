import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalServicesService } from 'src/app/GlobalServices/GlobalServices.service';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { Contrato, MedicaoLevantamento, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';

export class TabelaLevantamento {
  idItem: number;
  nome: string;
  medicoes: MedicaoLevantamento[] = [];
  medicaoTotal: number;
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
  listaContratos: string[] =[];

  dataSource = new MatTableDataSource<TabelaLevantamento>(this.dadosTabela);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { idProjeto: number, contrato: Contrato },
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService,
    private _medicaoControllerService: MedicoesService,
    private globalService: GlobalServicesService
  ) { }

  async ngOnInit() {
    this.createForm();
    await this.buscarProjetos();
    this.verificarRecebimento();
    this.dataSource.paginator = this.paginator;
  }

  createForm() {
    this.form = this.fb.group({
      projetoId: [{ value: 0}, Validators.required],
    });
  }

  verificarRecebimento() {
    if (this.data.idProjeto != 0) {
      this.listaProjetos;
      this.form.get('projetoId').setValue(this.data.idProjeto);
      this.buscarMedicoesProjeto();
    }
  }

  async buscarProjetos() {
      const projetoRequest: ProjetoRequest = {
            nome: '',
            pagina: 1,
            itemsPorPagina: 1000000
      };

      await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
      .then((res) => {
        // const listaProjetosFilter = this.data.contrato ?
        // res.data.filter(resF => resF.contratos[0].contratos.prefeituraId == this.data.contrato.prefeituraId) :
        // res.data;

        // this.listaProjetos = listaProjetosFilter;

        this.listaProjetos = res.data;
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
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
      this.listaMedicoes = res.data;
      this.listaContratos = [];

      if (this.listaMedicoes.length != 0) {
        let dadoTabela: TabelaLevantamento;
        this.listaMedicoes.forEach((res) => {
          this.listaContratos.push(res.contratos.numeroContrato);

          res.items.forEach((resItem) => {
            const indexTab = this.dadosTabela.findIndex(resIndex => resIndex.idItem == resItem.itemsContrato.itemId);
            if (indexTab !== -1) {
              let medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
              medicaoLevantamento.qtdItem = resItem.unidade;
              medicaoLevantamento.idItemContrato = resItem.idItemContrato;
              medicaoLevantamento.valorComBdi = resItem.itemsContrato.item.valorComBdi;

              this.dadosTabela[indexTab].medicaoTotal += medicaoLevantamento.qtdItem * medicaoLevantamento.valorComBdi;
              this.dadosTabela[indexTab].medicoes.push(medicaoLevantamento);
            }
            else {
              dadoTabela = new TabelaLevantamento();

              let medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
              medicaoLevantamento.qtdItem = resItem.unidade;
              medicaoLevantamento.idItemContrato = resItem.idItemContrato;
              medicaoLevantamento.valorComBdi = resItem.itemsContrato.item.valorComBdi;

              dadoTabela.idItem = resItem.itemsContrato.itemId
              dadoTabela.nome = resItem.itemsContrato.item.descricao
              dadoTabela.medicaoTotal = medicaoLevantamento.valorComBdi * medicaoLevantamento.qtdItem;
              dadoTabela.medicoes.push(medicaoLevantamento);

              this.dadosTabela.push(dadoTabela);
            }
          });
        });

        this.maxMedicoes = Math.max(...this.dadosTabela.map(item => item.medicoes.length));
        this.displayedColumns = ['nome', ...Array.from({ length: this.maxMedicoes }, (_, i) => `medicao${i + 1}`), 'medicaoTotal'];
        this.dataSource.data = this.dadosTabela;
      }
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    });
  }

  isRowHidden(row: any): boolean {
    // Verifique se todos os valores de qtdItem para as medições dessa linha são 0
    for (let i = 0; i < this.maxMedicoes; i++) {
      if (row.medicoes[i] && row.medicoes[i].qtdItem !== 0) {
        return false;  // Se algum valor de qtdItem for diferente de 0, não oculta a linha
      }
    }
    return true;  // Se todos os qtdItem forem 0, oculta a linha
  }


  async buscarMedicoesProjeto(){
    this.dataSource.data = [];
    this.dadosTabela = [];
    const projetoId: number = this.form.get('projetoId').value;
    if (projetoId) {
      const projetoSelecionado = this.listaProjetos.find(res => res.idProjeto == projetoId);

      if (!projetoSelecionado) {
        this._toastService.mensagemError("Projeto não encontrado na lista");
      }

      this.buscarMedicao(projetoId, projetoSelecionado.contratos[0].idContrato);
    }
    else {
      this._toastService.messageWarning("Um projeto deve ser selecionado!");
    }
  }

  buscarItemMedicao(idItemContrato: number){
    var items = this.globalService.getItems(idItemContrato);
    return this.globalService.getItems(idItemContrato)?.quantidades;
  }

  formatToCurrency(valor: number): string {
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    valorFormatado = valorFormatado.replace('.', ',');

    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + valorFormatado;
  }

  multiplicarValorTotalMedicao(medicao: MedicoesResponse[], numero: number, idItemContrato: number){
    let valorMultiplicado = 0;

    var medicaoFiltrada = medicao.find(x => x.numeroMedicao == numero);

    medicaoFiltrada.items.forEach(med => {
      if (med.idItemContrato == idItemContrato) {
        valorMultiplicado = med.unidade * med.itemsContrato.item.valorComBdi;
      }
    });

    return valorMultiplicado
  }

}
