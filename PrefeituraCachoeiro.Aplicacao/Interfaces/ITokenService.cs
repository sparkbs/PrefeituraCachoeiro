using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface ITokenService
    {
        Task<AccessTokenResponse> GerarToken(VerificarLoginRequest request, CancellationToken cancellationToken);
    }
}