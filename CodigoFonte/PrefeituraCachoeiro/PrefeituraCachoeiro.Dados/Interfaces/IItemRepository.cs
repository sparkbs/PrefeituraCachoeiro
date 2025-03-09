using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IItemRepository
    {
        Task<List<ItemEntidade>> BuscarTodosAsync(int idTemplate, CancellationToken cancellationToken);
        Task<ItemEntidade> InserirAsync(ItemEntidade item, CancellationToken cancellationToken);
    }
}