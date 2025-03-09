using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IItemsAditivoRepository
    {
        Task<ItemsAditivoEntidade> InserirAsync(ItemsAditivoEntidade items, CancellationToken cancellationToken);
        Task<List<ItemsAditivoEntidade>> BuscarTodosItemsAditivosAsync(int idAditivo, CancellationToken cancellationToken);
    }
}