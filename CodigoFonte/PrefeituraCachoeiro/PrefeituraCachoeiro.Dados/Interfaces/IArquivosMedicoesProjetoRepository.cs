using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IArquivosMedicoesProjetoRepository
    {
        Task<PaginatedEntity<ArquivosMedicoesProjetoEntidade>> BuscarTodosAsync(BuscarArquivosMedicoesProjetoFilter filter, CancellationToken cancellationToken);
        Task<ArquivosMedicoesProjetoEntidade> InserirAsync(ArquivosMedicoesProjetoEntidade arquivo, CancellationToken cancellationToken);
    }
}