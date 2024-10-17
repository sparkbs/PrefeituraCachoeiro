using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{

    [ExcludeFromCodeCoverage]
    public class ProjetoDataResponse
    {
        public List<ProjetoResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}