using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IEmpresaService
    {
        Task<Result<EmpresaResponse>> BuscarPorIdAsync(int idEmpresa, CancellationToken cancellationToken);
        Task<Result<EmpresaDataResponse>> BuscarTodosAsync(EmpresaFilter filter, CancellationToken cancellationToken);
        Task<Result<CriarEmpresaResponse>> InserirAsync(CriarEmpresaRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarEmpresaResponse>> AtualizarAsync(AtualizarEmpresaRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarEmpresaResponse>> DeletarAsync(int idEmpresa, CancellationToken cancellationToken);
    }
}