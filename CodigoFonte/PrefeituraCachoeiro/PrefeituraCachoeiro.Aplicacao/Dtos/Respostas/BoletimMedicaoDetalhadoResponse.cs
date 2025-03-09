using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class BoletimMedicaoDetalhadoResponse
    {
        public BoletimDetalhadoCabecalhoResponse BoletimDetalhadoCabecalho { get; set; }
        public List<BoletimDetalheMedicaoDetalhadoResponse> Detalhes { get; set; }
        public decimal ValorTotalMedicao { get; set; }
    }
}