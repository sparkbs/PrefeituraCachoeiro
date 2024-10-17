using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class GruposDataResponse
    {
        public List<GruposResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}