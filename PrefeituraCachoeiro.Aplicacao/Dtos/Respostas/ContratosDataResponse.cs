using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ContratosDataResponse
    {
        public List<ContratosResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}