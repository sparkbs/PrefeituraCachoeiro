import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ItemContrato, ItemMedicao, ItemResumo, MedicoesModel, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';

@Component({
  selector: 'app-resumoMedicao',
  templateUrl: './resumoMedicao.component.html',
  styleUrls: ['./resumoMedicao.component.scss']
})
export class ResumoMedicaoComponent implements OnInit {
  dataSource: MatTableDataSource<ItemResumo>;
  displayedColumns: string[] = ['nome', 'unidadeTotal', 'unidadeTotalMedida', 'valor(c)Bdi', 'valorTotalMedido', 'valorTotalItem'];
  itemsToLoad : MedicoesModel[];
  lista: ItemResumo[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: MedicoesModel[]) { 
    
    // Tente inicializar com dados brutos
//    this.dataSource = new MatTableDataSource(this.data.contratos.items);
  }

  ngOnInit() {
    this.itemsToLoad = this.data;
  
    const todosItens: ItemMedicao[] = this.data
      .flatMap(model => model.data || [])
      .flatMap(inner => inner.items || []);
  
    const itensFiltrados = todosItens.filter(item => 
      item.unidade && item.unidade !== 0
    );
  
    const agrupadosComSoma = itensFiltrados.reduce((acc, item) => {
      const key = item.unidade;
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      const nome = item.itemsContrato.item.descricao || 'Sem nome';
      const valorComBdi = item.itemsContrato.item.valorComBdi || 0;
      const unidadeSalvaMedida = Number(item.unidadeSalvaMedida) || 0;
      const unidadeTotal = Number(item.itemsContrato.unidadeOriginal) || 0;
  
      const itemExistente = acc[key].find(i => 
        i.nome === nome && i.valorComBdi === valorComBdi
      );
  
      if (itemExistente) {
        itemExistente.unidadeTotalMedida += unidadeSalvaMedida;
      } else {
        acc[key].push({
          nome,
          valorComBdi,
          unidadeTotal,
          unidadeTotalMedida: unidadeSalvaMedida
        });
      }
  
      return acc;
    }, {} as { [unidade: number]: ItemResumo[] });
  
    const resumoPorUnidade = Object.values(agrupadosComSoma).flat();
    this.lista = resumoPorUnidade;
    console.log(this.lista);

    this.dataSource = new MatTableDataSource(this.lista);
    console.log(this.dataSource);
  }
  
  calcularValorTotalItem(unidade: string, precoComBdi: number){
    if (!unidade) {
      return 0;
    }
    var quantidadeItem = parseFloat(unidade);
    return (precoComBdi * quantidadeItem);
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