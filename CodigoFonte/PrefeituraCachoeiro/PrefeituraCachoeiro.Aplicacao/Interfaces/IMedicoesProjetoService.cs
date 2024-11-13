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
    }
}