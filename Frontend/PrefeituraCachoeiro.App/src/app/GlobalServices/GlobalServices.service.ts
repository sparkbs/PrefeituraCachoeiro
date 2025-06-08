import { Injectable } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { StatusMedicaoEnum } from '../enums/statusMedicao';

@Injectable({
  providedIn: 'root'
})
export class GlobalServicesService {
  public itensMedidos: ItensMedidos[] = [];
  public itemInvalido: boolean = false;

  constructor(private _toastService: ToastService) { }

  addItem(nome: string, quantidade: number, idItemContrato:number, quantidadeMedida:number, isContratoGlobal:boolean, idStatusMedicao: number) {
    let itemExiste = this.itensMedidos.find(x => x.idItemContrato == idItemContrato);
    if(itemExiste == null){
      var restante = 0;
      if(idStatusMedicao != StatusMedicaoEnum.Aprovada){
        restante = quantidade - quantidadeMedida;
      }
      else{
        restante = quantidade;
      }
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
      var restante = 0;
      if(idStatusMedicao != StatusMedicaoEnum.Aprovada){
        restante = itemExiste.quantidades - quantidadeMedida;
      }else{
        restante = itemExiste.quantidades;
      }

      if(restante < 0 && !isContratoGlobal){
        this.itemInvalido = true;
        this._toastService.mensagemError("Não é permitido a quantidade restante de cada item ser menor que 0!");
      }
      else{
        if(restante < 0 && isContratoGlobal){
          itemExiste.quantidades = restante;          
          this.itemInvalido = false;
        }
        else{
            itemExiste.quantidades = restante;          
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