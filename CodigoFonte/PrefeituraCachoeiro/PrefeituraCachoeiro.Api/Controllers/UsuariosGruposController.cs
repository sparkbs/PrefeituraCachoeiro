using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento de adicionar usuários a grupos
    /// </summary>
    [Route("v1/usuariosgrupos")]
    [ApiController]
    public class UsuariosGruposController : Controller
    {
        private readonly IUsuariosGruposService _usuariosGruposService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="usuariosGruposService">Instância da classe IUsuariosGruposService</param>
        public UsuariosGruposController(IUsuariosGruposService usuariosGruposService)
        {
            _usuariosGruposService = usuariosGruposService;
        }

        /// <summary>
        /// Retorna todos os grupos associados ao usuário informado
        /// </summary>
        /// <response code="200">Retorna uma lista de grupos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("BuscarGruposPorUsuarioIdAsync")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<GruposResponse>))]
        //[Authorize]
        public async Task<IActionResult> BuscarGruposPorUsuarioIdAsync([FromBody] BuscarGruposPorUsuarioIdRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _usuariosGruposService.BuscarGruposPorUsuarioIdAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os grupos disponíveis para associar ao usuário informado
        /// </summary>
        /// <response code="200">Retorna uma lista de grupos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("BuscarGruposDisponiveisPorUsuarioIdAsync")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<GruposResponse>))]
        //[Authorize]
        public async Task<IActionResult> BuscarGruposDisponiveisPorUsuarioIdAsync([FromBody] BuscarGruposDisponiveisPorUsuarioIdRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _usuariosGruposService.BuscarGruposDisponiveisPorUsuarioIdAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Associar o usuário ao grupo informado
        /// </summary>
        /// <response code="200">Retorna id do usuário grupo criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("inserir")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarUsuariosGruposResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarUsuariosGruposRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _usuariosGruposService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um usuário de um determinado grupo
        /// </summary>
        /// <response code="200">Retorna uma mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("deletar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarUsuarioGrupoResponse))]
        //[Authorize]
        public async Task<IActionResult> DeletarAsync([FromForm] DeletarUsuarioGrupoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _usuariosGruposService.DeletarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}