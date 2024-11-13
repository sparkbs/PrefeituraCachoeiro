using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ArquivosMedicoesProjetoDataResponse
    {
        public List<ArquivosMedicoesProjetoResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}