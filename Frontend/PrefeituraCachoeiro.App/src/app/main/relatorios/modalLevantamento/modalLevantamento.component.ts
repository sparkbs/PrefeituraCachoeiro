import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { GlobalServicesService } from 'src/app/GlobalServices/GlobalServices.service';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { Contrato, MedicaoLevantamento, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
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
  somaTotalMedicoes: number = 0;
  isLoading = false;
  listaPrefeituras: PrefeituraResponse[] =[];

  dataSource = new MatTableDataSource<TabelaLevantamento>(this.dadosTabela);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { idProjeto: number, contrato: Contrato },
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService,
    private _medicaoControllerService: MedicoesService,
    public _prefeituraControllerService: PrefeituraService,
    private globalService: GlobalServicesService
  ) { }

  async ngOnInit() {
    this.createForm();
    await this.buscarProjetos();
    await this.buscarTodasPrefeituras();
    this.verificarRecebimento();
    this.dataSource.paginator = this.paginator;
  }

  createForm() {
    this.form = this.fb.group({
      projetoId: [{ value: 0}, Validators.required],
    });
  }

  async buscarTodasPrefeituras() {
    const filter: PrefeituraFilter = {
      itemsPorPagina: 10000,
      pagina: 1,
      nome: ""
    };

    await this._prefeituraControllerService.BuscarTodasPrefeituras(filter)
    .then((res) => {
      this.listaPrefeituras = res.data;
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
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

async buscarMedicao(projetoId: number, contratoId: number, projeto: ProjetoResponse) {
  const medicoesRequest: MedicoesRequest = new MedicoesRequest();
  medicoesRequest.codigoProjeto = projeto.codigoProjeto;
  medicoesRequest.prefeituraId = projeto.idPrefeitura;
  medicoesRequest.itemsPorPagina = 1000000;
  medicoesRequest.pagina = 1;

  await this._medicaoControllerService.BuscarTodasProjetosHistoricos(medicoesRequest)
    .then((res) => {
      this.listaMedicoes = res.data.filter(
        x => x.idStatusMedicao === StatusMedicaoEnum.Aprovada || x.idStatusMedicao === StatusMedicaoEnum.Enviada
      );

      this.listaContratos = [];
      this.dadosTabela = [];
      this.somaTotalMedicoes = 0;

      const colunasQuantidade = 10; // limite máximo de colunas (ajuste conforme necessário)
      let colunaIndex = 0;

      const mapChaveMedicao: Map<string, number> = new Map(); // chave: numeroMedicao+numeroContrato -> índice
      const listaMedicoesOrdenadas: { chave: string, numero: number, contrato: string }[] = [];

      if (this.listaMedicoes.length !== 0) {
        this.listaMedicoes.forEach((medicao) => {
          const numeroContrato = medicao.contratos.numeroContrato;
          const chave = `${medicao.numeroMedicao}_${numeroContrato}`;

          // Apenas adiciona chave se ainda não foi mapeada
          if (!mapChaveMedicao.has(chave)) {
            mapChaveMedicao.set(chave, colunaIndex);
            this.listaContratos.push(numeroContrato);
            listaMedicoesOrdenadas.push({ chave, numero: medicao.numeroMedicao, contrato: numeroContrato });
            colunaIndex++;
          }

          medicao?.items.forEach((item) => {
            const indexTab = this.dadosTabela.findIndex(
              resIndex => resIndex.idItem === item.itemsContrato.itemId
            );

            const medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
            medicaoLevantamento.numeroMedicao = chave;
            medicaoLevantamento.qtdItem = item.unidade;
            medicaoLevantamento.idItemContrato = item.idItemContrato;
            medicaoLevantamento.valorComBdi = item.itemsContrato.item.valorComBdi;

            if (indexTab !== -1) {
              const tabItem = this.dadosTabela[indexTab];
              tabItem.medicaoTotal += medicaoLevantamento.qtdItem * medicaoLevantamento.valorComBdi;
              tabItem.medicoes[mapChaveMedicao.get(chave)!] = medicaoLevantamento;
            } else {
              const dadoTabela: TabelaLevantamento = new TabelaLevantamento();
              dadoTabela.idItem = item.itemsContrato.itemId;
              dadoTabela.nome = item.itemsContrato.item.descricao;
              dadoTabela.medicaoTotal = medicaoLevantamento.qtdItem * medicaoLevantamento.valorComBdi;
              dadoTabela.medicoes = [];

              // Preenche os índices com `undefined` até o índice correto
              dadoTabela.medicoes[mapChaveMedicao.get(chave)!] = medicaoLevantamento;

              this.dadosTabela.push(dadoTabela);
            }
          });
        });

        this.dadosTabela.forEach(res => {
          this.somaTotalMedicoes += res.medicaoTotal;
        });

        this.maxMedicoes = colunaIndex;
        this.displayedColumns = ['nome', ...Array.from({ length: this.maxMedicoes }, (_, i) => `medicao${i + 1}`), 'medicaoTotal'];
        this.dataSource.data = this.dadosTabela;
      }
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    });
}


  /*async buscarMedicao(projetoId: number, contratoId: number, projeto: ProjetoResponse) {
    /*console.log(projeto);
    console.log(this.listaPrefeituras)
    var prefeitura = this.listaPrefeituras.find(x => x.nome == projeto.nomePrefeitura);
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.codigoProjeto = projeto.codigoProjeto;
    medicoesRequest.prefeituraId = projeto.idPrefeitura;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;

    // Buscar pelo codigo do projeto, esperar o endpoint do fred
    await this._medicaoControllerService.BuscarTodasProjetosHistoricos(medicoesRequest)

    //await this._medicaoControllerService.BuscarTodasMedicoes(medicoesRequest)
    .then((res) => {
      this.listaMedicoes = res.data.filter(x => x.idStatusMedicao == StatusMedicaoEnum.Aprovada || x.idStatusMedicao == StatusMedicaoEnum.Enviada);
      this.listaContratos = [];

      if (this.listaMedicoes.length != 0) {
        let dadoTabela: TabelaLevantamento;
        this.listaMedicoes.forEach((res) => {
          this.listaContratos.push(res.contratos.numeroContrato);

          res.items.forEach((resItem) => {
            const indexTab = this.dadosTabela.findIndex(resIndex => resIndex.idItem == resItem.itemsContrato.itemId);
            if (indexTab !== -1) {
              let medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
              medicaoLevantamento.numeroMedicao = res.numeroMedicao;
              medicaoLevantamento.qtdItem = resItem.unidade;
              medicaoLevantamento.idItemContrato = resItem.idItemContrato;
              medicaoLevantamento.valorComBdi = resItem.itemsContrato.item.valorComBdi;

              this.dadosTabela[indexTab].medicaoTotal += medicaoLevantamento.qtdItem * medicaoLevantamento.valorComBdi;
              this.dadosTabela[indexTab].medicoes.push(medicaoLevantamento);
            }
            else {
              dadoTabela = new TabelaLevantamento();

              let medicaoLevantamento: MedicaoLevantamento = new MedicaoLevantamento();
              medicaoLevantamento.numeroMedicao = res.numeroMedicao;
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

        this.dadosTabela.forEach(res => {
          this.somaTotalMedicoes += res.medicaoTotal;
        });

        this.maxMedicoes = Math.max(...this.dadosTabela.map(item => item.medicoes.length));
        this.displayedColumns = ['nome', ...Array.from({ length: this.maxMedicoes }, (_, i) => `medicao${i + 1}`), 'medicaoTotal'];
        this.dataSource.data = this.dadosTabela;
      }
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    });
  }*/

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
    this.isLoading = true;
    this.somaTotalMedicoes = 0;
    this.dataSource.data = [];
    this.dadosTabela = [];
    const projetoId: number = this.form.get('projetoId').value;
    if (projetoId) {
      const projetoSelecionado = this.listaProjetos.find(res => res.idProjeto == projetoId);

      if (!projetoSelecionado) {
        this._toastService.mensagemError("Projeto não encontrado na lista");
      }

      await this.buscarMedicao(projetoId, projetoSelecionado.contratos[0].idContrato, projetoSelecionado);
    }
    else {
      this._toastService.messageWarning("Um projeto deve ser selecionado!");
    }
    this.isLoading = false;
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

  multiplicarValorTotalMedicao(medicao: MedicoesResponse[], numero: number, idItemContrato: number, medicaoNum: number){

    let valorMultiplicado = 0;

    var medicaoFiltrada = medicao.filter(x => x.numeroMedicao == medicaoNum);

    medicaoFiltrada.forEach(medicao => {
      medicao.items.forEach(med => {
        if (med.idItemContrato == idItemContrato) {
          console.log(this.dadosTabela);
          console.log(valorMultiplicado);
          valorMultiplicado = med.unidade * med.itemsContrato.item.valorComBdi;
        }
      });
    });

    return valorMultiplicado
  }

  retornarNumeroMedicao(index: number): number {
    return this.listaMedicoes[index].numeroMedicao;
  }

}
