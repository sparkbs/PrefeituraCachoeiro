using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class QuantidadeResponse
    {
        public int IdQuantidade { get; set; }
        public string? Nome { get; set; }
    }
}