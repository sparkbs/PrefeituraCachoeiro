using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IStatusMedicaoRepository
    {
        Task<List<StatusMedicaoEntidade>> BuscarTodosAsync(CancellationToken cancellationToken);
    }
}