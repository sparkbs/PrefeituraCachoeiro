using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IOrigemRepository
    {
        Task<OrigemEntidade?> BuscarPorNomeAsync(string nome, CancellationToken cancellationToken);
        Task<OrigemEntidade?> BuscarPorIdAsync(int idOrigem, CancellationToken cancellationToken);
        Task<OrigemEntidade> InserirAsync(OrigemEntidade origem, CancellationToken cancellationToken);
        Task<int> CriarNovoId(CancellationToken cancellationToken);
    }
}