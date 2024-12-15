import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Contrato, Empresa, Item, ItemContrato, ItemMedicao, MedicoesResponse, Origem, Prefeitura, Projeto, Quantidade, StatusMedicao } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ProjetoService } from 'src/app/services/projeto.service';

@Component({
  selector: 'app-listaMedicao',
  templateUrl: './listaMedicao.component.html',
  styleUrls: ['./listaMedicao.component.scss']
})
export class ListaMedicaoComponent implements OnInit, OnChanges {
  @Input() medicoes: MedicoesResponse = new MedicoesResponse();
  
  dataSource: MatTableDataSource<ItemMedicao>;
  displayedColumns: string[] = ['item', 'codigo', 'origem', 'item/qtd', 'valor(s)cBdi' , 'valorTotal/bdi', 'qtdMedicaoItem', 'valorTotalMedidaBdi'];

  alterarMedicaoProjeto1 = false;
  alterarMedicaoProjeto2 = false;
  alterarMedicaoProjeto3 = false;
  constructor(private readonly api: ProjetoService) {
    this.dataSource = new MatTableDataSource(this.medicoes.items);    
   }

  ngOnInit() {
    console.log(this.medicoes)
  }

  ngOnChanges(changes: SimpleChanges) {
    // Verifica se a entrada 'medicoes' foi alterada
    if (changes['medicoes']) {
      this.dataSource.data = this.medicoes.items || [];
    }
  }

  formatToCurrency(valor: number): string {
    console.log(valor)
    // Formatar o valor como string com 2 casas decimais
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    // Substituir o ponto (.) por vírgula para separar os decimais
    valorFormatado = valorFormatado.replace('.', ',');

    // Adicionar o separador de milhar (ponto) para valores maiores que 1.000
    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Adicionar o prefixo 'R$'
    return 'R$ ' + valorFormatado;
  }

  somarValorTotal(){
    let valorSomado = 0;
    this.medicoes.items.forEach( x => {
      valorSomado += x.itemsContrato.valorTotalComBdi
    })

    return valorSomado
  }
}
