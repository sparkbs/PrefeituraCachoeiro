using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento dos grupos
    /// </summary>
    [Route("v1/grupos")]
    [ApiController]
    public class GruposController : Controller
    {
        private readonly IGruposService _gruposService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="gruposService">Instância de IGruposService</param>
        public GruposController(IGruposService gruposService)
        {
            _gruposService = gruposService;
        }

        /// <summary>
        /// Retorna um grupo pelo identificador
        /// </summary>
        /// <response code="200">Retorna um grupo pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GruposResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _gruposService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os grupos de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de grupos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GruposDataResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] GruposFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _gruposService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria um novo grupo
        /// </summary>
        /// <response code="200">Retorna id do grupo criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarGrupoResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarGrupoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _gruposService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza um grupo.
        /// </summary>
        /// <response code="200">Retorna id do grupo atualizado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarGrupoResponse))]
        //[Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarGrupoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _gruposService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um grupo
        /// </summary>
        /// <response code="200">Retorna id do grupo deletado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarGrupoResponse))]
        //[Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _gruposService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}