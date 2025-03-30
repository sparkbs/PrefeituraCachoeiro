import { BoletimBase } from "./boletim-base.model";
import { BoletimCabecalho } from "./boletim-cabecalho.model"


export class BoletimDetalhadoModel {
  boletimDetalhadoCabecalho?: BoletimCabecalho;  // Cabeçalho com dados gerais do boletim
  valorTotalMedicao!: number; // Total geral da medição (se necessário)
  subBoletins?: BoletimBase[];  // Subitens relacionados ao item principal  
}