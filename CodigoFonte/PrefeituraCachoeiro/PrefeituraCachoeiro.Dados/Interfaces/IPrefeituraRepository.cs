using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IPrefeituraRepository
    {
        Task<PaginatedEntity<PrefeituraEntidade>> BuscarTodosAsync(PrefeituraFilter filter, CancellationToken cancellationToken);
        Task<PrefeituraEntidade?> BuscarPorIdAsync(int idPrefeitura, CancellationToken cancellationToken);
        Task<PrefeituraEntidade> InserirAsync(PrefeituraEntidade prefeitura, CancellationToken cancellationToken);
        Task<PrefeituraEntidade> AtualizarAsync(PrefeituraEntidade prefeitura, CancellationToken cancellationToken);
        Task<PrefeituraEntidade> DeletarAsync(PrefeituraEntidade prefeitura, CancellationToken cancellationToken);
    }
}