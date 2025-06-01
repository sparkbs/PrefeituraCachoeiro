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
  empresa: string;
  secretaria: string;
  idEmpresa: number;
  dataMedicao: string;
  numeroMedicao: number;
  projeto: string;
  subCabecalho: string;
  subBoletins: SubBoletim[];
  resumo: string = '';
  periodoMedicao: string = '';
}

export class SubBoletim {
  numero: string;
  codigoAta: string;
  descricao: string;
  quantidade: number;
  quantidadeResponse: QuantidadeResponse;
  unidade: string;
  precoSemBdi: number;
  bdi: number;
  precoComBdi: number;
  valorTotal: number;
}

export class BoletimDetalhadoResponse {
  boletimMedicaoCabecalho: BoletimProjetoCabecalho;
  detalhes: Detalhe[];
  valorTotalMedicao: number;
}

export class BoletimMedicaoDetalhadoResponse {
  boletimDetalhadoCabecalho: BoletimProjetoCabecalho;
  detalhes: Detalhe[];
  valorTotalMedicao: number;
}

export class QuantidadeResponse {
  idQuantidade: number;
  nome: string;
}
