export class Origem {
    idOrigem: number = 0;
    nome: string = '';
}

export class Quantidade {
    idQuantidade: number = 0;
    nome: string = '';
}

export class Items {
    idItemContrato: number = 0;
    idContrato: number = 0;
    itemId: number = 0;
    item: Item = new Item();
    quantidadeId: number = 0;
    quantidade: Quantidade = new Quantidade();
    unidade: number = 0;
    valorSemBdi: number = 0;
    valorComBdi: number = 0;
    valorTotalComBdi: number = 0;
}

export class Item{
    idItem: number = 0;
    identificador: string = '';
    codigo: string = '';
    origemId: number = 0;
    origem: Origem = new Origem();
    descricao: string = '';
    unidade: number = 0;
    quantidadeId: number = 0;
    quantidade: Quantidade = new Quantidade();
    valorSemBdi: number = 0;
    valorComBdi: number = 0 ;
    valorTotalComBdi: number = 0;
    idItemPai: number = 0;
    ordem: number = 0;
}

export class Projeto {
    idProjeto: number = 0;
    nomeProjeto: string = '';
}

export class DadosContratoResponse {
    idContrato: number = 0;
    idProjeto: number = 0;
    projeto: Projeto = new Projeto();
    dataContrato: string = '';
    numeroContrato: string = '';
    valorTotalPrevisto: number = 0;
    valorTotalSolicitado: number = 0;
    valorTotalMedido: number = 0;
    valorSaldoRestante: number = 0;
    items: Items[] = [];
}
