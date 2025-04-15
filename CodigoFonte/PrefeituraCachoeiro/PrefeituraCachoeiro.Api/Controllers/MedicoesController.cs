using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento das medições
    /// </summary>
    [Route("v1/medicoes")]
    [ApiController]
    public class MedicoesController : Controller
    {
        private readonly IMedicoesProjetoService _medicoesProjetoService;
        private readonly IArquivosMedicoesProjetoService _arquivosMedicoesProjetoService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="medicoesProjetoService">Instância de IMedicoesProjetoService</param>
        public MedicoesController(IMedicoesProjetoService medicoesProjetoService, IArquivosMedicoesProjetoService arquivosMedicoesProjetoService)
        {
            _medicoesProjetoService = medicoesProjetoService;
            _arquivosMedicoesProjetoService = arquivosMedicoesProjetoService;
        }

        /// <summary>
        /// Retorna uma medição pelo identificador
        /// </summary>
        /// <response code="200">Retorna uma medição pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MedicoesProjetoResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todas as medições de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de medições</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MedicoesProjetoDataResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] MedicoesProjetoFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria uma nova medição
        /// </summary>
        /// <response code="200">Retorna id da medição criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("inserir")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarMedicoesProjetoResponse))]
        [Authorize]
        public async Task<IActionResult> InserirAsync([FromBody] CriarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Aprovar uma medição específica
        /// </summary>
        /// <response code="200">Retorna sucesso ou a mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("aprovar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResultadoRegistrarAprovacaoMedicaoResponse))]
        [Authorize]
        public async Task<IActionResult> AprovarAsync([FromForm] RegistrarAprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.RegistrarAprovacao(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Reprovar uma medição específica
        /// </summary>
        /// <response code="200">Retorna sucesso ou a mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("reprovar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResultadoRegistrarReprovacaoMedicaoResponse))]
        [Authorize]
        public async Task<IActionResult> ReprovarAsync([FromForm] RegistrarReprovacaoMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.RegistrarReprovacao(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza uma medição.
        /// </summary>
        /// <response code="200">Retorna id da medição atualizada/response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut("alterar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarMedicoesProjetoResponse))]
        [Authorize]
        public async Task<IActionResult> AtualizarAsync([FromBody] AtualizarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Registrar um ou mais arquivos a uma medição de projeto
        /// </summary>
        /// <response code="200">Retorna sucesso ou a mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("registrardocumentos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RegistrarDocumentosMedicaoResponse))]
        [Authorize]
        public async Task<IActionResult> RegistrarDocumentosAsync([FromForm] RegistrarDocumentosMedicaoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.RegistrarDocumentosAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Apagar um arquivo de medição de projeto
        /// </summary>
        /// <response code="200">Retorna uma mensagem de confirmação</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("apagararquivomedicao/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarContratoResponse))]
        [Authorize]
        public async Task<IActionResult> DeletarArquivoMedicaoAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _arquivosMedicoesProjetoService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Método responsável por realizar o download de um determinado arquivo
        /// </summary>
        /// <param name="id">Identificador do arquivo</param>
        /// <param name="cancellationToken">Token de cancelamento</param>
        /// <returns>Retorna um stream contendo as informações do arquivo</returns>
        [HttpGet("downloadarquivomedicao/{id}")]
        [Authorize]
        public async Task<IActionResult> DownloadArquivoMedicaoAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _stream = await this._arquivosMedicoesProjetoService.DownloadArquivoMedicao(id, cancellationToken);

                return File(_stream, "application/octet-stream", this.CriarNomeArquivoAleatorio());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao processar o download: {ex.Message}");
            }
        }

        /// <summary>
        /// Realiza o envio de uma medição ao cliente
        /// </summary>
        /// <response code="200">Retorna sucesso ou a mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("enviarcliente")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ResultadoRegistrarEnvioMedicaoClienteResponse))]
        [Authorize]
        public async Task<IActionResult> EnviarMedicaoClienteAsync([FromForm] RegistrarEnvioMedicaoClienteRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.RegistrarEnvioMedicaoClienteAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        private string CriarNomeArquivoAleatorio()
        {
            return ($"Arquivo_{DateTime.Now.ToString("ddMMyyyyhhmms")}");
        }

        /// <summary>
        /// Deleta uma medição
        /// </summary>
        /// <response code="200">Retorna uma mensagem de sucesso ou erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarMedicaoResponse))]
        [Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}