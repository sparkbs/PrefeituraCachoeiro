using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class VerificarLoginResponse
    {
        public string? Login { get; set; }
        public bool IsSucesso { get; set; }
        public string? AccessToken { get; set; }

        public VerificarLoginResponse(): this(string.Empty, false, string.Empty)
        {

        }

        public VerificarLoginResponse(string? login, bool isSucesso): this(login, isSucesso, string.Empty)
        {

        }

        public VerificarLoginResponse(string? login, bool isSucesso, string? accessToken)
        {
            Login = login;
            IsSucesso = isSucesso;
            AccessToken = accessToken;
        }
    }
}