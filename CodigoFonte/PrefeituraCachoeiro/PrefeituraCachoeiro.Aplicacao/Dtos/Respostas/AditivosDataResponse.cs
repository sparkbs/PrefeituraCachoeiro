using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class AditivosDataResponse
    {
        public List<AditivosResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}