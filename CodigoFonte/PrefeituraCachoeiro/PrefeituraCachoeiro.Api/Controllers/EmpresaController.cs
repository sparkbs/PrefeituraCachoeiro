using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento das empresas
    /// </summary>
    [Route("v1/empresa")]
    [ApiController]
    public class EmpresaController : Controller
    {
        private readonly IEmpresaService _empresaService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="empresaService">Instância de IEmpresaService</param>
        public EmpresaController(IEmpresaService empresaService)
        {
            _empresaService = empresaService;
        }

        /// <summary>
        /// Retorna uma empresa pelo identificador
        /// </summary>
        /// <response code="200">Retorna uma empresa pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmpresaResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _empresaService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todas as empresas de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de empresas</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmpresaDataResponse))]
        //[Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] EmpresaFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _empresaService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria uma nova empresa
        /// </summary>
        /// <response code="200">Retorna id da empresa criada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarEmpresaResponse))]
        //[Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarEmpresaRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _empresaService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza uma empresa
        /// </summary>
        /// <response code="200">Retorna id da empresa atualizada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarEmpresaResponse))]
        //[Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarEmpresaRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _empresaService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta uma empresa
        /// </summary>
        /// <response code="200">Retorna uma mensagem da ação executada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarEmpresaResponse))]
        //[Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _empresaService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}