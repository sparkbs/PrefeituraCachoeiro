export class BoletimBase{
  numero!: string;
  codigoATA!: string | null;
  descricao!: string;
  quantidade!: number | null;
  unidade!: string | null;
  precoSemBDI!: number | null;
  bdi!: number | null;
  precoComBDI!: number | null;
  valorTotal!: number | null;
  subBoletins?: BoletimBase[]; // SubBoletins dentro de um boletim principal
  subitens?: BoletimBase[]; // Subitens dentro de um subBoletim
}