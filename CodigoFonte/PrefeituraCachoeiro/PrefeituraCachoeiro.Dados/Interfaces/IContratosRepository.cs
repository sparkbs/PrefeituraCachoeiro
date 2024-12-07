using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IContratosRepository
    {
        Task<PaginatedEntity<ContratosEntidade>> BuscarTodosAsync(ContratosFilter filter, CancellationToken cancellationToken);
        Task<ContratosEntidade?> BuscarPorIdAsync(int idContrato, CancellationToken cancellationToken);
        Task<ContratosEntidade> InserirAsync(ContratosEntidade contrato, CancellationToken cancellationToken);
        Task<ContratosEntidade> AtualizarAsync(ContratosEntidade contrato, CancellationToken cancellationToken);
        Task<ContratosEntidade> DeletarAsync(ContratosEntidade contrato, CancellationToken cancellationToken);
        Task<ContratosEntidade?> BuscarPorIdProjetoAsync(int idProjeto, CancellationToken cancellationToken);
        Task AdicionarProjetoContratoAsync(ContratosProjetosEntidade projeto, CancellationToken cancellationToken);
        Task RemoverProjetoContratoAsync(ContratosProjetosEntidade projeto, CancellationToken cancellationToken);
        Task<bool> VerificarProjetoAssociadoContratoAsync(int idContrato, int idProjeto, CancellationToken cancellationToken);
        Task<ContratosProjetosEntidade?> BuscarProjetoInContratoAsync(int idContrato, int idProjeto, CancellationToken cancellationToken);
    }
}