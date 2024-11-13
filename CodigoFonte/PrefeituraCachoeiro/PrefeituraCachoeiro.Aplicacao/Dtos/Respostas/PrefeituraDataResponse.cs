using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class PrefeituraDataResponse
    {
        public List<PrefeituraResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}