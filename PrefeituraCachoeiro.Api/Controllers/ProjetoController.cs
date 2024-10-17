using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Construtor parametrizado
    /// </summary>
    [Route("v1/projetos")]
    [ApiController]
    public class ProjetoController : Controller
    {
        private readonly IProjetoService _projetoService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="projetoService">Instância da classe IProjetoService</param>
        public ProjetoController(IProjetoService projetoService)
        {
            _projetoService = projetoService;
        }

        /// <summary>
        /// Retorna um projeto pelo identificador
        /// </summary>
        /// <response code="200">Retorna um projeto pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProjetoResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _projetoService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os projetos de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de projeto</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProjetoDataResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] ProjetosFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _projetoService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria um novo projeto
        /// </summary>
        /// <response code="200">Retorna id do projeto criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarProjetoResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _projetoService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza um projeto.
        /// </summary>
        /// <response code="200">Retorna id do projeto atualizado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarProjetoResponse))]
        //[Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarProjetoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _projetoService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um projeto
        /// </summary>
        /// <response code="200">Retorna id do projeto deletado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarProjetoResponse))]
        //[Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _projetoService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
   }
}