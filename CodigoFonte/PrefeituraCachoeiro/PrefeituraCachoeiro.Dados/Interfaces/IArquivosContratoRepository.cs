using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IArquivosContratoRepository
    {
        Task<ArquivosContratosEntidade> InserirAsync(ArquivosContratosEntidade arquivos, CancellationToken cancellationToken);
        Task DeletarAsync(ArquivosContratosEntidade arquivo, CancellationToken cancellationToken);
        Task<ArquivosContratosEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
    }
}