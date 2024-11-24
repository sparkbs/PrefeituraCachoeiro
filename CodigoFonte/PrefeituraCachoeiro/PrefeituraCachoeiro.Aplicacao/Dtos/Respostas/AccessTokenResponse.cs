using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class AccessTokenResponse
    {
        public bool Authenticated { get; set; }
        public string? Created { get; set; }
        public string? Expiration { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int IdUsuario { get; set; }
        public string Nome { get; set; }
        public string Login { get; set; }
    }
}