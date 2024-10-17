using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class OrigemResponse
    {
        public int IdOrigem { get; set; }
        public string? Nome { get; set; }
    }
}