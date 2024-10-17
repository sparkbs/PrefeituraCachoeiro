using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IProjetoRepository
    {
        Task<PaginatedEntity<ProjetoEntidade>> BuscarTodosAsync(ProjetosFilter filter, CancellationToken cancellationToken);
        Task<ProjetoEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
        Task<ProjetoEntidade> InserirAsync(ProjetoEntidade projeto, CancellationToken cancellationToken);
        Task<ProjetoEntidade> AtualizarAsync(ProjetoEntidade projeto, CancellationToken cancellationToken);
        Task<ProjetoEntidade> DeletarAsync(ProjetoEntidade projeto, CancellationToken cancellationToken);
    }
}