using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento do usuário
    /// </summary>
    [Route("v1/usuarios")]
    [ApiController]
    public class UsuariosController : Controller
    {
        private readonly IUsuariosService _usuariosService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="usuariosService">Instância da classe IUsuariosService</param>
        public UsuariosController(IUsuariosService usuariosService)
        {
            _usuariosService = usuariosService;
        }

        /// <summary>
        /// Retorna um usuário pelo identificador
        /// </summary>
        /// <response code="200">Retorna um usuário pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UsuariosResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _usuariosService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os usuários de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de usuarios</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UsuariosDataResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] UsuariosFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _usuariosService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria um novo usuário
        /// </summary>
        /// <response code="200">Retorna id do usuário criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarUsuarioResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarUsuarioRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _usuariosService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza um usuário.
        /// </summary>
        /// <response code="200">Retorna id do usuário atualizado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarUsuarioResponse))]
        //[Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarUsuarioRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _usuariosService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um usuário
        /// </summary>
        /// <response code="200">Retorna id do usuário deletado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarUsuarioResponse))]
        //[Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _usuariosService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}