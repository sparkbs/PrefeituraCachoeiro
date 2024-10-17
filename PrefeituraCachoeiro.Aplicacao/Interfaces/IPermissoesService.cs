using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IPermissoesService
    {
        Task<Result<List<TiposPermissoesResponse>>> BuscarPermissoesPorGrupoIdAsync(CriarBuscarPermissoesPorGrupoIdRequest requisicao, CancellationToken cancellationToken);
        Task<Result<CriarPermissoesResponse>> InserirAsync(CriarPermissoesRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarPermissaoResponse>> DeletarAsync(DeletarPermissaoRequest requisicao, CancellationToken cancellationToken);
    }
}