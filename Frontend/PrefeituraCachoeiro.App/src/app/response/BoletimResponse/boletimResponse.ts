export class BoletimResponse {
  boletimProjetoCabecalho: BoletimProjetoCabecalho;
  detalhes: Detalhe[];
  valorTotalMedicao: number;
}

export class BoletimProjetoCabecalho {
  nomePrefeitura: string;
  nomeUnidade: string;
  tipoBoletimEmissao: string;
  resumoBoletim: string = '';
  descontoFiscalizacao: string = '';
  bdi01: number = 0;
  bdi02: string = '';
  dataMedicao: Date = new Date();
  numeroMedicao: number = 0;
  contrato: string = '';
  nomeProjeto: string = '';
  nomeBoletim: string = '';
  bdi: number = 0;
  logoTipoImg!: File | string;
}

export class Detalhe {
  dataMedicao: string;
  numeroMedicao: number;
  projeto: string;
  subCabecalho: string;
  subBoletins: SubBoletim[];
}

export class SubBoletim {
  numero: string;
  codigoAta: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  precoSemBdi: number;
  bdi: number;
  precoComBdi: number;
  valorTotal: number;
}
