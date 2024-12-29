import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalServicesService } from 'src/app/GlobalServices/GlobalServices.service';
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
  displayedColumns: string[] = ['item', 'item/qtd', 'valor(s)cBdi' , 'valorTotal/bdi','qtdRestante', 'qtdMedicaoItem', 'valorTotalMedidaBdi', 'valorSaldoRestante'];

  alterarMedicaoProjeto = false;
  constructor(private readonly apiMedicao: MedicoesService, private readonly api: ProjetoService,private globalService: GlobalServicesService) {
    this.dataSource = new MatTableDataSource(this.medicoes.items);    
   }

  ngOnInit() {    
    this.medicoes.items.forEach(item =>{
      item.unidadeSalvaMedida = item.unidade;
      this.globalService.addItem(item.itemsContrato.item.descricao, item.itemsContrato.unidade, item.idItemContrato, item.unidade)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medicoes']) {
      this.dataSource.data = this.medicoes.items || [];
    }
  }

  aprovarMedicao(){
    
  }

  onChange(item: ItemMedicao){
    console.log(item.unidade);
    console.log('quantidade inicio '+item.unidadeSalvaMedida);
    let quantidade = item.unidade - item.unidadeSalvaMedida;
    console.log(quantidade);
    this.globalService.addItem("",0, item.idItemContrato,quantidade)
    item.unidadeSalvaMedida = item.unidade;
  }

  buscarItemMedicao(idItemContrato: number){
    return this.globalService.getItems(idItemContrato).quantidades;
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

  somarValorSaldoTotal(){
    let valorSaldoSomado = 0;
    this.medicoes.items.forEach( x => {
      valorSaldoSomado += this.buscarItemMedicao(x.idItemContrato) * x.itemsContrato.item.valorComBdi
    })
    
    return valorSaldoSomado
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
