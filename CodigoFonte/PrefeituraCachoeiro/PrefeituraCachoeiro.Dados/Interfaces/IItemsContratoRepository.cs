using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IItemsContratoRepository
    {
        Task<ItemsContratoEntidade?> BuscarPorIdAsync(int idItemContrato, CancellationToken cancellationToken);
    }
}