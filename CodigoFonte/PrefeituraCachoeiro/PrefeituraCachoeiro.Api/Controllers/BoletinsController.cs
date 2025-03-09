using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    [Route("v1/boletins")]
    [ApiController]
    public class BoletinsController : Controller
    {
        private readonly IMedicoesProjetoService _medicoesProjetoService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="medicoesProjetoService">Instância de IMedicoesProjetoService</param>
        public BoletinsController(IMedicoesProjetoService medicoesProjetoService)
        {
            _medicoesProjetoService = medicoesProjetoService;
        }

        /// <summary>
        /// Retorna todas as medições de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de medições</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscarboletimmedicao")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BoletimMedicaoResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarBoletimMedicaoAsync([FromBody] BuscarBoletimMedicaoFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.BuscarBoletimMedicaoAsync(filtro.IdMedicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todas as medições de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de medições</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscarboletimmedicaodetalhado")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BoletimMedicaoResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarBoletimMedicaoDetalhadoAsync([FromBody] BuscarBoletimMedicaoDetalhadoFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.BuscarBoletimMedicaoDetalhadoAsync(filtro.IdMedicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todas as medições de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de medições</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscarboletimprojeto")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BoletimProjetoResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarBoletimProjetoAsync([FromBody] BuscarBoletimProjetoFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _medicoesProjetoService.BuscarBoletimProjetoAsync(filtro.IdMedicao, filtro.IdProjeto, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}