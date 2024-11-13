using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IParametrosSistemaService
    {
        Task<Result<ParametrosSistemaResponse>> BuscarPorIdAsync(CancellationToken cancellationToken);
    }
}