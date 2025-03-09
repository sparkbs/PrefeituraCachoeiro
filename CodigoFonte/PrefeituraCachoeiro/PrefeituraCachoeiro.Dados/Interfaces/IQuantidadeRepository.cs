using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IQuantidadeRepository
    {
        Task<QuantidadeEntidade?> BuscarPorNomeAsync(string nome, CancellationToken cancellationToken);
        Task<QuantidadeEntidade?> BuscarPorIdAsync(int idQuantidade, CancellationToken cancellationToken);
        Task<QuantidadeEntidade> InserirAsync(QuantidadeEntidade quantidade, CancellationToken cancellationToken);
        Task<int> CriarNovoId(CancellationToken cancellationToken);
    }
}