using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IArquivosMedicoesProjetoRepository
    {
        Task<PaginatedEntity<ArquivosMedicoesProjetoEntidade>> BuscarTodosAsync(BuscarArquivosMedicoesProjetoFilter filter, UsuariosEntidade? usuarioLogado, CancellationToken cancellationToken);
        Task<ArquivosMedicoesProjetoEntidade> InserirAsync(ArquivosMedicoesProjetoEntidade arquivo, CancellationToken cancellationToken);
        Task<ArquivosMedicoesProjetoEntidade> DeletarAsync(ArquivosMedicoesProjetoEntidade arquivo, CancellationToken cancellationToken);
        Task<ArquivosMedicoesProjetoEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
    }
}