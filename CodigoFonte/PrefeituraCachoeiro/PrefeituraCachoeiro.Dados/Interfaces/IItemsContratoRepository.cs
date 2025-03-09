using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IItemsContratoRepository
    {
        Task<ItemsContratoEntidade?> BuscarPorIdAsync(int idItemContrato, CancellationToken cancellationToken);
        Task<ItemsContratoEntidade> InserirAsync(ItemsContratoEntidade items, CancellationToken cancellationToken);
        Task<List<ItemsContratoEntidade>> BuscarTodosItemsContratosAsync(int idContrato, CancellationToken cancellationToken);
        Task<ItemsContratoEntidade> AtualizarAsync(ItemsContratoEntidade item, CancellationToken cancellationToken);
    }
}