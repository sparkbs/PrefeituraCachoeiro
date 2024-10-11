using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ItemResponse
    {
        public int IdItem { get; set; }
        public string? Identificador { get; set; }
        public string? Codigo { get; set; }
        public int IdOrigem { get; set; }
        public OrigemResponse Origem { get; set; }
        public string? Descricao { get; set; }
        public decimal? Unidade { get; set; }
        public int? IdQuantidade { get; set; }
        public QuantidadeResponse Quantidade { get; set; }
        public decimal? ValorSemBdi { get; set; }
        public decimal? ValorComBdi { get; set; }
        public decimal? ValorTotalComBdi { get; set; }
        public int? IdItemPai { get; set; }
        public int Ordem { get; set; }
    }
}