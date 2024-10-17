using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class VerificarLoginRequest
    {
        public string? Login { get; set; }
        public string? Senha { get; set; }
    }
}
