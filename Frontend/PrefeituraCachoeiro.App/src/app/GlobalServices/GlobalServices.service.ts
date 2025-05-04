import { Injectable } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalServicesService {
  public itensMedidos: ItensMedidos[] = [];
  public itemInvalido: boolean = false;

  constructor(private _toastService: ToastService) { }

  addItem(nome: string, quantidade: number, idItemContrato:number, quantidadeMedida:number, isContratoGlobal:boolean) {
    let itemExiste = this.itensMedidos.findIndex(x => x.idItemContrato == idItemContrato);
    if(itemExiste == -1){
      var restante = quantidade - quantidadeMedida;
      if(restante < 0 && !isContratoGlobal){
        this.itemInvalido = true;
        this._toastService.mensagemError("Não é permitido a quantidade restante de cada item ser menor que 0!");
      }
      else{
        let item : ItensMedidos = new ItensMedidos();
        item.nomes = nome;
        item.quantidades = restante;
        item.idItemContrato = idItemContrato;
        this.itensMedidos.push(item);
        this.itemInvalido = false;
      }
    }
    else{
      var restante = this.itensMedidos[itemExiste].quantidades - quantidadeMedida;
      if(restante < 0 && !isContratoGlobal){
        this.itemInvalido = true;
        this._toastService.mensagemError("Não é permitido a quantidade restante de cada item ser menor que 0!");
      }
      else{
        if(restante < 0 && isContratoGlobal){
          console.log("test")
          this.itensMedidos[itemExiste].quantidades = restante;
          this.itemInvalido = false;
        }
        else{
          this.itensMedidos[itemExiste].quantidades = restante;
          this.itemInvalido = false;
        }
      }
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