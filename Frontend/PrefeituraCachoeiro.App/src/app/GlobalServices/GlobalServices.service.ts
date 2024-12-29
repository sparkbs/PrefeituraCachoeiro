import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalServicesService {
  public itensMedidos: ItensMedidos[] = [];

  constructor() { }

  addItem(nome: string, quantidade: number, idItemContrato:number, quantidadeMedida:number) {
    let itemExiste = this.itensMedidos.findIndex(x => x.idItemContrato == idItemContrato);
    if(itemExiste == -1){
      var restante = quantidade - quantidadeMedida;
      let item : ItensMedidos = new ItensMedidos();
      item.nomes = nome;
      item.quantidades = restante;
      item.idItemContrato = idItemContrato;
      this.itensMedidos.push(item);
    }
    else{
      var restante = this.itensMedidos[itemExiste].quantidades - quantidadeMedida;

      this.itensMedidos[itemExiste].quantidades = restante;
    }

  }

  // Método para obter todos os nomes e quantidades
  getItems(idItemContrato: number) {
    let item = this.itensMedidos.find(x => x.idItemContrato == idItemContrato);

    return { idItem: item.idItemContrato, nomes: item.nomes, quantidades: item.quantidades };
  }

  // Método para resetar os valores
  resetItems() {
    this.itensMedidos = [];
  }

}

export class ItensMedidos{
  quantidades: number = 0;
  nomes: string = '';
  idItemContrato: number = 0;
}