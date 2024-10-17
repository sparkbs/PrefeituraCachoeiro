using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class StatusMedicaoResponse
    {
        public int IdStatusMedicao { get; set; }
        public string? Nome { get; set; }
    }
}