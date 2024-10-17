using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IUsuariosService
    {
        Task<Result<UsuariosResponse>> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
        Task<Result<UsuariosDataResponse>> BuscarTodosAsync(UsuariosFilter filter, CancellationToken cancellationToken);
        Task<Result<CriarUsuarioResponse>> InserirAsync(CriarUsuarioRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarUsuarioResponse>> AtualizarAsync(AtualizarUsuarioRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarUsuarioResponse>> DeletarAsync(int id, CancellationToken cancellationToken);
    }
}