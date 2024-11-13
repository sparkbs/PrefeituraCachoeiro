using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IItemsMedicoesProjetoRepository
    {
        Task<bool> DeletarAsync(int idMedicoesProjeto, CancellationToken cancellationToken);
        Task<List<ItemsMedicoesProjetoEntidade>> BuscarTodosAsync(int idMedicoesProjetos, CancellationToken cancellationToken);
    }
}