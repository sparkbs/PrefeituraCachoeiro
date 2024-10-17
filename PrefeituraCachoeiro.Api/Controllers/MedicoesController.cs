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

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="medicoesProjetoService">Instância de IMedicoesProjetoService</param>
        public MedicoesController(IMedicoesProjetoService medicoesProjetoService)
        {
            _medicoesProjetoService = medicoesProjetoService;
        }

        /// <summary>
        /// Retorna uma medição pelo identificador
        /// </summary>
        /// <response code="200">Retorna uma medição pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MedicoesProjetoResponse))]
        //[Authorize]
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
        //[Authorize]
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
        //[Authorize]
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
        //[Authorize]
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
        //[Authorize]
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
        //[Authorize]
        public async Task<IActionResult> AtualizarAsync([FromBody] AtualizarMedicoesProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}