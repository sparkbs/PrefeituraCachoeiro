using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IUsuariosGruposRepository
    {
        Task<UsuariosGruposEntidade> InserirAsync(UsuariosGruposEntidade grupo, CancellationToken cancellationToken);
        Task<UsuariosGruposEntidade> DeletarAsync(UsuariosGruposEntidade grupo, CancellationToken cancellationToken);
        Task<List<GruposEntidade>> BuscarGruposPorUsuarioIdAsync(int usuarioId, CancellationToken cancellationToken);
        Task<List<GruposEntidade>> BuscarGruposDisponiveisPorUsuarioIdAsync(int usuarioId, CancellationToken cancellationToken);
        Task<UsuariosGruposEntidade?> BuscarUsuarioGruposAsync(int usuarioId, int grupoId, CancellationToken cancellationToken);
    }
}