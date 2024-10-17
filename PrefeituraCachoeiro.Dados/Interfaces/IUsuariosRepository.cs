using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IUsuariosRepository
    {
        Task<PaginatedEntity<UsuariosEntidade>> BuscarTodosAsync(UsuariosFilter filter, CancellationToken cancellationToken);
        Task<UsuariosEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
        Task<UsuariosEntidade> InserirAsync(UsuariosEntidade grupo, CancellationToken cancellationToken);
        Task<UsuariosEntidade> AtualizarAsync(UsuariosEntidade grupo, CancellationToken cancellationToken);
        Task<UsuariosEntidade> DeletarAsync(UsuariosEntidade grupo, CancellationToken cancellationToken);
        Task<UsuariosEntidade?> BuscarPorLogingAsync(string login, CancellationToken cancellationToken);
    }
}