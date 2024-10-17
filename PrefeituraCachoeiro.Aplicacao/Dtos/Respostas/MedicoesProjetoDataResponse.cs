using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class MedicoesProjetoDataResponse
    {
        public List<MedicoesProjetoResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}