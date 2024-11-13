using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Interfaces
{
    public interface IParametrosSistemaRepository
    {
        Task<ParametrosSistemaEntidade?> BuscarUnicoRegistro(CancellationToken cancellationToken);
    }
}