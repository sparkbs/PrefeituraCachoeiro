import { BoletimBase } from "./boletim-base.model";
import { BoletimCabecalho } from "./boletim-cabecalho.model";

export class BoletimProjetoModel {
  projetoId?: number;
  boletimProjetoCabecalho?: BoletimCabecalho;
  valorTotalMedicao?: number;
  subBoletins?: BoletimBase[];
}
