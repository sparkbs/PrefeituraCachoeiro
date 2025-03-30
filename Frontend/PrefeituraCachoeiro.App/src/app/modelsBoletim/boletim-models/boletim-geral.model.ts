import { BoletimBase } from "./boletim-base.model";
import { BoletimCabecalho } from "./boletim-cabecalho.model";

export class BoletimGeralModel {
    boletimGeralCabecalho?: BoletimCabecalho;
    valorTotalMedicao?: number;
    boletins?: BoletimBase[]; // Lista de boletins detalhados  
}