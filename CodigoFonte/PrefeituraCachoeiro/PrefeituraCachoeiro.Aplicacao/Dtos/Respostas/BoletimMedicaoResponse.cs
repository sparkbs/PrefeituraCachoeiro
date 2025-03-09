using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class BoletimMedicaoResponse
    {
        public BoletimMedicaoCabecalhoResponse BoletimMedicaoCabecalho { get; set; }
        public List<BoletimDetalheMedicaoResponse> Detalhes { get; set; }
        public decimal ValorTotalMedicao { get; set; }
    }
}