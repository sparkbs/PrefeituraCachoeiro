using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ItemsAditivoSimpleResponse
    {
        public int IdItemAditivo { get; set; }
        public int AditivoId { get; set; }
        public int ItemId { get; set; }
        public ItemSimplesResponse Item { get; set; }
        public int QuantidadeId { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }
    }
}