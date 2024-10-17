using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento de permissões de grupos
    /// </summary>
    [Route("v1/permissoes")]
    [ApiController]
    public class PermissaoController : Controller
    {
        private readonly IPermissoesService _permissoesService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="usuariosGruposService">Instância da classe IPermissoesService</param>
        public PermissaoController(IPermissoesService permissoesService)
        {
            _permissoesService = permissoesService;
        }

        /// <summary>
        /// Retorna todas as permissões associadas ao grupo informado
        /// </summary>
        /// <response code="200">Retorna uma lista de tipos de permissões</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("BuscarPermissoesPorGrupoId")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<TiposPermissoesResponse>))]
        //[Authorize]
        public async Task<IActionResult> BuscarPermissoesPorGrupoIdAsync([FromBody] CriarBuscarPermissoesPorGrupoIdRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _permissoesService.BuscarPermissoesPorGrupoIdAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Associar a permissão ao grupo informado
        /// </summary>
        /// <response code="200">Retorna id da permissão criada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("inserir")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarPermissoesResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarPermissoesRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _permissoesService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta uma permissão de um determinado grupo
        /// </summary>
        /// <response code="200">Retorna uma mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("deletar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarPermissaoResponse))]
        //[Authorize]
        public async Task<IActionResult> DeletarAsync([FromForm] DeletarPermissaoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _permissoesService.DeletarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}