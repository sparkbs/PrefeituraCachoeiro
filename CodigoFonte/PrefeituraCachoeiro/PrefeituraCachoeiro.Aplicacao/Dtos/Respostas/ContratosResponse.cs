using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ContratosResponse
    {
        public int IdContrato { get; set; }
        public int IdProjeto { get; set; }
        public ProjetoResponse Projeto { get; set; }
        public DateTime DataContrato { get; set; }
        public string? NumeroContrato { get; set; }
        public decimal? ValorTotalPrevisto { get; set; }
        public decimal? ValorTotalSolicitado { get; set; }
        public decimal? ValorTotalMedido { get; set; }
        public decimal? ValorSaldoRestante { get; set; }
        public IEnumerable<ItemsContratoResponse> Items { get; set; }
    }
}