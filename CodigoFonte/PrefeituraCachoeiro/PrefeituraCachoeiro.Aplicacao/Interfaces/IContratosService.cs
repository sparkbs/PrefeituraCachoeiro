using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IContratosService
    {
        Task<Result<ContratosDataResponse>> BuscarTodosAsync(ContratosFilter filter, CancellationToken cancellationToken);
        Task<Result<ContratosResponse>> BuscarPorIdAsync(int idContrato, CancellationToken cancellationToken);
        Task<Result<CriarContratoResponse>> InserirAsync(CriarContratoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarContratosResponse>> AtualizarAsync(AtualizarContratosRequest requisicao, CancellationToken cancellationToken);
    }
}