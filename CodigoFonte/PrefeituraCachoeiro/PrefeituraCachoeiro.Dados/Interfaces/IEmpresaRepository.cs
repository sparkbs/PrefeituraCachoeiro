using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IEmpresaRepository
    {
        Task<PaginatedEntity<EmpresaEntidade>> BuscarTodosAsync(EmpresaFilter filter, CancellationToken cancellationToken);
        Task<EmpresaEntidade?> BuscarPorIdAsync(int idEmpresa, CancellationToken cancellationToken);
        Task<EmpresaEntidade> InserirAsync(EmpresaEntidade empresa, CancellationToken cancellationToken);
        Task<EmpresaEntidade> AtualizarAsync(EmpresaEntidade empresa, CancellationToken cancellationToken);
        Task<EmpresaEntidade> DeletarAsync(EmpresaEntidade empresa, CancellationToken cancellationToken);
    }
}