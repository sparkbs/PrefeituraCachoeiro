using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class BoletimProjetoResponse
    {
        public BoletimProjetoCabecalhoResponse BoletimProjetoCabecalho { get; set; }
        public List<BoletimDetalheProjetoResponse> Detalhes { get; set; }
        public decimal ValorTotalMedicao { get; set; }
        public int ProjetoId { get; set; }
    }
}
