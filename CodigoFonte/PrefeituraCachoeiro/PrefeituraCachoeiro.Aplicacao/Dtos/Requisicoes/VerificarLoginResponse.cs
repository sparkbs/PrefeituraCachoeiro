using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class VerificarLoginResponse
    {
        public string? Login { get; set; }
        public bool IsSucesso { get; set; }
        public AccessTokenResponse AccessToken { get; set; }

        public VerificarLoginResponse()
        {

        }

        public VerificarLoginResponse(string? login, bool isSucesso, AccessTokenResponse accessToken)
        {
            Login = login;
            IsSucesso = isSucesso;
            AccessToken = accessToken;
        }
    }
}