using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IArquivosContratoRepository
    {
        Task<ArquivosContratosEntidade> InserirAsync(ArquivosContratosEntidade arquivos, CancellationToken cancellationToken);
    }
}