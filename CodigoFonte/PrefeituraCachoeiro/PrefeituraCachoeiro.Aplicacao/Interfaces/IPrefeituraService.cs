using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IPrefeituraService
    {
        Task<Result<PrefeituraResponse>> BuscarPorIdAsync(int idPrefeitura, CancellationToken cancellationToken);
        Task<Result<PrefeituraDataResponse>> BuscarTodosAsync(PrefeituraFilter filter, CancellationToken cancellationToken);
        Task<Result<CriarPrefeituraResponse>> InserirAsync(CriarPrefeituraRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarPrefeituraResponse>> AtualizarAsync(AtualizarPrefeituraRequest requisicao, CancellationToken cancellationToken);
        Task<Result<DeletarPrefeituraResponse>> DeletarAsync(int idPrefeitura, CancellationToken cancellationToken);
        Task<MemoryStream> DownloadArquivoLogo(int prefeituraid, CancellationToken cancellationToken);
    }
}