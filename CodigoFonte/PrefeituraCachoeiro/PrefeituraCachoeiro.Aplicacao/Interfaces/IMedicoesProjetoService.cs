using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IMedicoesProjetoService
    {
        Task<Result<MedicoesProjetoDataResponse>> BuscarTodosAsync(MedicoesProjetoFilter filter, CancellationToken cancellationToken);
        Task<Result<MedicoesProjetoResponse>> BuscarPorIdAsync(int idMedicoesProjeto, CancellationToken cancellationToken);
        Task<Result<CriarMedicoesProjetoResponse>> InserirAsync(CriarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<ResultadoRegistrarAprovacaoMedicaoResponse>> RegistrarAprovacao(RegistrarAprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<ResultadoRegistrarReprovacaoMedicaoResponse>> RegistrarReprovacao(
            RegistrarReprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<AtualizarMedicoesProjetoResponse>> AtualizarAsync(AtualizarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<BoletimMedicaoResponse>> BuscarBoletimMedicaoAsync(int idProjeto, CancellationToken cancellationToken);
        Task<Result<BoletimProjetoResponse>> BuscarBoletimProjetoAsync(int idMedicao, int idProjeto, CancellationToken cancellationToken);
        Task<Result<BoletimMedicaoDetalhadoResponse>> BuscarBoletimMedicaoDetalhadoAsync(int idMedicao, CancellationToken cancellationToken);
        Task<Result<MedicoesProjetoResponse>> BuscarUltimaMedicaoPorContratoIdAsync(int idContrato, CancellationToken cancellationToken);
        Task<Result<RegistrarDocumentosMedicaoResponse>> RegistrarDocumentosAsync(RegistrarDocumentosMedicaoRequest requisicao, CancellationToken cancellationToken);
        Task<Result<ResultadoRegistrarEnvioMedicaoClienteResponse>> RegistrarEnvioMedicaoClienteAsync(RegistrarEnvioMedicaoClienteRequest requisicao, CancellationToken cancellationToken);

    }
}