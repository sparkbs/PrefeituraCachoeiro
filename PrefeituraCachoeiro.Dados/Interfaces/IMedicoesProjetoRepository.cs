using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Dto;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IMedicoesProjetoRepository
    {
        Task<PaginatedEntity<MedicoesProjetoEntidade>> BuscarTodosAsync(MedicoesProjetoFilter filter, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade?> BuscarPorIdAsync(int idMedicoesProjeto, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade> InserirAsync(MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken);
        Task<MedicoesProjetoEntidade> AtualizarAsync(MedicoesProjetoEntidade medicoesProjeto, CancellationToken cancellationToken);
    }
}