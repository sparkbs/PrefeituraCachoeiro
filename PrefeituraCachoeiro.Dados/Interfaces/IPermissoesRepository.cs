using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IPermissoesRepository
    {
        Task<PermissoesEntidade> InserirAsync(PermissoesEntidade permissao, CancellationToken cancellationToken);
        Task<PermissoesEntidade> DeletarAsync(PermissoesEntidade permissao, CancellationToken cancellationToken);
        Task<List<TipoPermissoesEntidade>> BuscarPermissoesPorGrupoIdAsync(int grupoId, CancellationToken cancellationToken);
        Task<PermissoesEntidade?> BuscarPermissaoGruposAsync(int grupoId, int tipoPermissaoId, CancellationToken cancellationToken);
    }
}