import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlterarMedicaoProjetoRequest, DadosMedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { Contrato, Empresa, Item, ItemContrato, ItemMedicao, MedicoesResponse, Origem, Prefeitura, Projeto, Quantidade, StatusMedicao } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';

@Component({
  selector: 'app-listaMedicao',
  templateUrl: './listaMedicao.component.html',
  styleUrls: ['./listaMedicao.component.scss']
})
export class ListaMedicaoComponent implements OnInit, OnChanges {
  @Input() medicoes: MedicoesResponse = new MedicoesResponse();
  
  dataSource: MatTableDataSource<ItemMedicao>;
  displayedColumns: string[] = ['item', 'item/qtd', 'valor(s)cBdi' , 'valorTotal/bdi', 'qtdMedicaoItem', 'valorTotalMedidaBdi'];

  alterarMedicaoProjeto = false;
  constructor(private readonly apiMedicao: MedicoesService, private readonly api: ProjetoService) {
    this.dataSource = new MatTableDataSource(this.medicoes.items);    
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medicoes']) {
      this.dataSource.data = this.medicoes.items || [];
    }
  }

  aprovarMedicao(){

  }

  async reprovarMedicao(idMedicao: number){
    let request = new DadosMedicoesRequest()
    request.dataRegistro = new Date().toString();
    request.resumo = "";
    request.idMedicoesProjeto = idMedicao;
    await this.apiMedicao.ReprovarMedicoes(request)
    .then((result) => {     
    });
  }

  enableEditInput(){
    this.alterarMedicaoProjeto = !this.alterarMedicaoProjeto;
  }

  formatToCurrency(valor: number): string {
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    valorFormatado = valorFormatado.replace('.', ',');

    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + valorFormatado;
  }

  somarValorTotal(){
    let valorSomado = 0;
    this.medicoes.items.forEach( x => {
      valorSomado += x.unidade * x.itemsContrato.item.valorComBdi
    })

    return valorSomado
  }

  async salvar(){
    //this.quantidadeMedida = 1;    
    let alterarMedicaoRequest = new AlterarMedicaoProjetoRequest();
    alterarMedicaoRequest.dataMedicao = this.medicoes.dataMedicao;
    alterarMedicaoRequest.idContrato = this.medicoes.idContrato;
    alterarMedicaoRequest.idMedicoesProjeto = this.medicoes.idMedicoesProjeto;
    const novaLista = this.medicoes.items.map(item => ({
      idItemContrato: item.idItemContrato,
      unidade: item.unidade || 0
    }));
    alterarMedicaoRequest.items = novaLista;
    alterarMedicaoRequest.numeroMedicao = this.medicoes.numeroMedicao;
    alterarMedicaoRequest.resumo = this.medicoes.resumo;

    await this.apiMedicao.AlterarMedicoes(alterarMedicaoRequest)
    .then((result) => {     
    });

    this.alterarMedicaoProjeto = false;
  }
}
