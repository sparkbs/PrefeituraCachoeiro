export class BoletimCabecalho {
  nomePrefeitura: string = '';
  nomeUnidade: string = '';
  tipoBoletimEmissao: string = '';
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
  logoTipoImg!: File | string; // Arquivo da Imagem
}