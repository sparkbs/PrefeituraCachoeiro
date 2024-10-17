using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IItemRepository
    {
        Task<List<ItemEntidade>> BuscarTodosAsync(CancellationToken cancellationToken);
    }
}