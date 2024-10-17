using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface ILogStatusMedicaoRepository
    {
        Task<PaginatedEntity<LogStatusMedicaoEntidade>> BuscarTodosAsync(LogStatusMedicaoFilter filter, CancellationToken cancellationToken);
        Task<LogStatusMedicaoEntidade?> BuscarPorIdAsync(int idLogStatusMedicao, CancellationToken cancellationToken);
        Task<LogStatusMedicaoEntidade> InserirAsync(LogStatusMedicaoEntidade logStatusMedicaoProjeto, CancellationToken cancellationToken);
    }
}