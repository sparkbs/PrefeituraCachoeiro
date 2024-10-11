using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável por listar os tipos de permissões
    /// </summary>
    [Route("v1/tipospermissoes")]
    [ApiController]
    public class TiposPermissoesController : Controller
    {
        private readonly ITiposPermissoesService _tiposPermissoesService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="gruposService">Instância de ITiposPermissoesService</param>
        public TiposPermissoesController(ITiposPermissoesService tiposPermissoesService)
        {
            _tiposPermissoesService = tiposPermissoesService;
        }

        /// <summary>
        /// Retorna todos os tipos de permissões existentes no sistema
        /// </summary>
        /// <response code="200">Retorna uma lista dos tipos de permissões</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<TiposPermissoesResponse>))]
        //[Authorize]
        public async Task<IActionResult> BuscarTodosAsync(CancellationToken cancellationToken)
        {
            var response = await _tiposPermissoesService.BuscarTodosAsync(cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}