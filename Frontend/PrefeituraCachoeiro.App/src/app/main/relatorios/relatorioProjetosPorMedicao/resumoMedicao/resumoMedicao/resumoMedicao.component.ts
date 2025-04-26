import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ItemContrato, ItemMedicao, MedicoesModel, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';

@Component({
  selector: 'app-resumoMedicao',
  templateUrl: './resumoMedicao.component.html',
  styleUrls: ['./resumoMedicao.component.scss']
})
export class ResumoMedicaoComponent implements OnInit {
  dataSource: MatTableDataSource<ItemContrato>;
  displayedColumns: string[] = ['item', 'origem', 'item/qtd', 'valor(s)cBdi', 'valorTotal/bdi'];
  itemsToLoad : MedicoesModel[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: MedicoesModel[]) { 
    
    // Tente inicializar com dados brutos
//    this.dataSource = new MatTableDataSource(this.data.contratos.items);
  }

  ngOnInit() {
    this.itemsToLoad = this.data;
  
    const todosItens: ItemMedicao[] = this.data
      .flatMap(model => model.data || []) // primeiro nível: entra no array "data"
      .flatMap(inner => inner.items || []); // segundo nível: pega os "items"
  
    const itensFiltrados = todosItens.filter(item => 
      item.unidade && item.unidade !== 0
    );
  
    const agrupadosComSoma = itensFiltrados.reduce((acc, item) => {
      const key = item.unidade;
  
      if (!acc[key]) {
        acc[key] = {
          unidade: key,
          totalUnidadeSalva: 0,
          itensResumo: []  // Aqui vão os nomes e valores com bdi
        };
      }
  
      acc[key].totalUnidadeSalva += Number(item.unidadeSalvaMedida) || 0;
      acc[key].itensResumo.push({
        nome: item.itemsContrato.item.descricao || item.itemsContrato.item.descricao || 'Sem nome',
        valorComBdi: item.itemsContrato.item.valorComBdi || 0,
        unidadeSalvaMedida: Number(item.unidadeSalvaMedida) || 0
      });
  
      return acc;
    }, {} as {
      [unidade: number]: {
        unidade: number,
        totalUnidadeSalva: number,
        itensResumo: {
          nome: string,
          valorComBdi: number,
          unidadeSalvaMedida: number
        }[]
      }
    });
  
    const resumoPorUnidade = Object.values(agrupadosComSoma);
  
    console.log("Resumo por unidade:", resumoPorUnidade);
    // this.dataSource = new MatTableDataSource(resumoPorUnidade);
  }
  
  
  

  formatToCurrency(valor: number): string {
    // Formatar o valor como string com 2 casas decimais
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    // Substituir o ponto (.) por vírgula para separar os decimais
    valorFormatado = valorFormatado.replace('.', ',');

    // Adicionar o separador de milhar (ponto) para valores maiores que 1.000
    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Adicionar o prefixo 'R$'
    return 'R$ ' + valorFormatado;
  }
}