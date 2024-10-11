using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface ITiposPermissoesRepository
    {
        Task<List<TipoPermissoesEntidade>> BuscarTodosAsync(CancellationToken cancellationToken);
    }
}