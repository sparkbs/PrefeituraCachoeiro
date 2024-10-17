using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface ITiposPermissoesService
    {
        Task<Result<List<TiposPermissoesResponse>>> BuscarTodosAsync(CancellationToken cancellationToken);
    }
}