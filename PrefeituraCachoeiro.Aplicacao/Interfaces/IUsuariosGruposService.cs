using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IUsuariosGruposService
    {
        Task<Result<List<GruposResponse>>> BuscarGruposPorUsuarioIdAsync(BuscarGruposPorUsuarioIdRequest requisicao, CancellationToken cancellationToken);
        Task<Result<List<GruposResponse>>> BuscarGruposDisponiveisPorUsuarioIdAsync(BuscarGruposDisponiveisPorUsuarioIdRequest requisicao, CancellationToken cancellationToken);
        Task<Result<CriarUsuariosGruposResponse>> InserirAsync(CriarUsuariosGruposRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarUsuarioGrupoResponse>> DeletarAsync(DeletarUsuarioGrupoRequest requisicao, CancellationToken cancellationToken);
    }
}