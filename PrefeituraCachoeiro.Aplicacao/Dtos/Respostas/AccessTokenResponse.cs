using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class AccessTokenResponse
    {
        public string? AccessToken { get; set; }
    }
}