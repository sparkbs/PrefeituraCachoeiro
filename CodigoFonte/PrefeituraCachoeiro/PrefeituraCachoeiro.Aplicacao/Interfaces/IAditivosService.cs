using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IAditivosService
    {
        Task<Result<CriarAditivoResponse>> InserirAsync(CriarAditivoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AditivosDataResponse>> BuscarTodosAsync(AditivosContratoFilter filter, CancellationToken cancellationToken);
        Task<Result<AditivosResponse>> BuscarPorIdAsync(int idAditivo, CancellationToken cancellationToken);
        Task<Result<DeletarAditivoResponse>> DeletarAsync(int id, CancellationToken cancellationToken);
        Task<MemoryStream> DownloadArquivoAditivo(int id, CancellationToken cancellationToken);
        Task<Result<DeletarArquivoAditivoResponse>> DeletarArquivoAnexadoAsync(int id, CancellationToken cancellationToken);
        Task<Result<RegistrarDocumentosAditivoResponse>> RegistrarDocumentosAsync(RegistrarDocumentosAditivoRequest requisicao, CancellationToken cancellationToken);
    }
}