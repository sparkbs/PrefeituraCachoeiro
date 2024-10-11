using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ItemsContratoResponse
    {
        public int IdItemContrato { get; set; }
        public int IdContrato { get; set; }
        public int IdItem { get; set; }
        public ItemResponse Item { get; set; }
        public int IdQuantidade { get; set; }
        public QuantidadeResponse Quantidade { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }
    }
}