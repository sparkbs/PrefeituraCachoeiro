using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IGruposRepository
    {
        Task<PaginatedEntity<GruposEntidade>> BuscarTodosAsync(GruposFilter filter, CancellationToken cancellationToken);
        Task<GruposEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
        Task<GruposEntidade> InserirAsync(GruposEntidade grupo, CancellationToken cancellationToken);
        Task<GruposEntidade> AtualizarAsync(GruposEntidade grupo, CancellationToken cancellationToken);
        Task<GruposEntidade> DeletarAsync(GruposEntidade grupo, CancellationToken cancellationToken);
    }
}