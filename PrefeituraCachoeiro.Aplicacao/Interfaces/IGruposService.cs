using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IGruposService
    {
        Task<Result<GruposResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
        Task<Result<GruposDataResponse>> BuscarTodosAsync(GruposFilter filter, CancellationToken cancellationToken);
        Task<Result<CriarGrupoResponse>> InserirAsync(CriarGrupoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarGrupoResponse>> AtualizarAsync(AtualizarGrupoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarGrupoResponse>> DeletarAsync(int id, CancellationToken cancellationToken);
    }
}