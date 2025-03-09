using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IAditivosRepository
    {
        Task<AditivosEntidade> InserirAsync(AditivosEntidade aditivo, CancellationToken cancellationToken);
        Task<List<AditivosEntidade>> BuscarTodosAsync(int idContrato, CancellationToken cancellationToken);
        Task<AditivosEntidade?> BuscarPorIdAsync(int idAditivo, CancellationToken cancellationToken);
        Task<AditivosEntidade> DeletarAsync(AditivosEntidade aditivo, CancellationToken cancellationToken);
    }
}