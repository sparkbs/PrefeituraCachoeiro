using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento dos contratos
    /// </summary>
    [Route("v1/contratos")]
    [ApiController]
    public class ContratosController : Controller
    {
        private readonly IContratosService _contratosService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="contratosService">Instância de IContratosService</param>
        public ContratosController(IContratosService contratosService)
        {
            _contratosService = contratosService;
        }

        /// <summary>
        /// Retorna um contrato pelo identificador
        /// </summary>
        /// <response code="200">Retorna um contrato pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ContratosResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _contratosService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os contratos de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de contratos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GruposDataResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] ContratosFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _contratosService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria um novo contrato
        /// </summary>
        /// <response code="200">Retorna id do contrato criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarContratoResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarContratoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _contratosService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza um contrato.
        /// </summary>
        /// <response code="200">Retorna id do contrato atualizado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarContratosResponse))]
        //[Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarContratosRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _contratosService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}