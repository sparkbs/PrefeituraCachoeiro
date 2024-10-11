using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IProjetoService
    {
        Task<Result<ProjetoResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
        Task<Result<ProjetoDataResponse>> BuscarTodosAsync(ProjetosFilter filter, CancellationToken cancellationToken);
        Task<Result<CriarProjetoResponse>> InserirAsync(CriarProjetoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarProjetoResponse>> AtualizarAsync(AtualizarProjetoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarProjetoResponse>> DeletarAsync(int id, CancellationToken cancellationToken);
    }
}