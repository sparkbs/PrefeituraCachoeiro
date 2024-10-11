namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ItemEntidade: EntidadeBase
    {
        public int IdItem { get; set; }
        public string? Identificador { get; set; }
        public string? Codigo { get; set; }
        public int OrigemIdOrigem { get; set; }
        public OrigemEntidade Origem { get; set; }
        public string? Descricao { get; set; }
        public decimal? Unidade { get; set; }
        public int? QuantidadeIdQuantidade { get; set; }
        public QuantidadeEntidade Quantidade { get; set; }
        public decimal? ValorSemBdi { get; set; }
        public decimal? ValorComBdi { get; set; }
        public decimal? ValorTotalComBdi { get; set; }
        public int? IdItemPai { get; set; }
        public int Ordem { get; set; }
    }
}