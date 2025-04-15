using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IArquivosAditivoRepository
    {
        Task<ArquivosAditivoEntidade> InserirAsync(ArquivosAditivoEntidade arquivos, CancellationToken cancellationToken);
        Task DeletarAsync(ArquivosAditivoEntidade arquivo, CancellationToken cancellationToken);
        Task<ArquivosAditivoEntidade?> BuscarPorIdAsync(int id, CancellationToken cancellationToken);
    }
}