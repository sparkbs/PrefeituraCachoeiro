using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ItemsProjetoResponse
    {
        public int IdItemProjeto { get; set; }
        public int IdProjeto { get; set; }
        public int ItemId { get; set; }
        public ItemResponse Item { get; set; }
        public int QuantidadeId { get; set; }
        public QuantidadeResponse Quantidade { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }
    }
}