using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class PrefeituraResponse
    {
        public int IdPrefeitura { get; set; }
        public string Nome { get; set; }
        public string Logo { get; set; }
    }
}