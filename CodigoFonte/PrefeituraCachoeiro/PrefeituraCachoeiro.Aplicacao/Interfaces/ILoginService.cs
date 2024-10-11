using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface ILoginService
    {
        Task<Result<VerificarLoginResponse>> VerificarLoginAsync(VerificarLoginRequest request, CancellationToken cancellationToken);
    }
}