using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class TokenService: ITokenService
    {
        public async Task<AccessTokenResponse> GerarToken(VerificarLoginRequest request, CancellationToken cancellationToken)
        {
            var result = new AccessTokenResponse()
            {
                AccessToken = "XY"
            };

            return result;
        }
    }
}