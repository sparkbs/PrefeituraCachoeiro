using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IArquivosMedicoesProjetoService
    {
        Task<Result<ArquivosMedicoesProjetoDataResponse>> BuscarTodosAsync(BuscarArquivosMedicoesProjetoFilter filter, CancellationToken cancellationToken);
    }
}