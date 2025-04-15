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
        Task<Result<DeletarContratoResponse>> DeletarAsync(int id, CancellationToken cancellationToken);
        Task<Result<AdicionarProjetoContratoResponse>> AdicionarProjetoContratoAsync(AdicionarProjetoContratoRequest request, CancellationToken cancellationToken);
        Task<Result<RemoverProjetoContratoResponse>> RemoverProjetoContratoAsync(RemoverProjetoContratoRequest request, CancellationToken cancellationToken);
        Task<Result<List<ContratosResponse>>> BuscarTodosAditivosAsync(int idContrato, CancellationToken cancellationToken);
        Task<Result<DeletarArquivoContratoResponse>> DeletarArquivoAnexadoAsync(int id, CancellationToken cancellationToken);
        Task<Result<RegistrarDocumentosContratoResponse>> RegistrarDocumentosAsync(RegistrarDocumentosContratoRequest requisicao, CancellationToken cancellationToken);
        Task<MemoryStream> DownloadArquivoContrato(int id, CancellationToken cancellationToken);
    }
}