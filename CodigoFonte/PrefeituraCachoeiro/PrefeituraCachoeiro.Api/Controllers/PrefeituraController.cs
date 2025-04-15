using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento das prefeituras
    /// </summary>
    [Route("v1/prefeitura")]
    [ApiController]
    public class PrefeituraController : Controller
    {
        private readonly IPrefeituraService _prefeituraService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="prefeituraService">Instância de IPrefeituraService</param>
        public PrefeituraController(IPrefeituraService prefeituraService)
        {
            _prefeituraService = prefeituraService;
        }

        /// <summary>
        /// Retorna uma prefeitura pelo identificador
        /// </summary>
        /// <response code="200">Retorna uma prefeitura pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PrefeituraResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _prefeituraService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todas as prefeituras de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de prefeituas</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PrefeituraDataResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] PrefeituraFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _prefeituraService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria uma nova prefeitura
        /// </summary>
        /// <response code="200">Retorna id da prefeitura criada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarPrefeituraResponse))]
        [Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarPrefeituraRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _prefeituraService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza uma prefeitura
        /// </summary>
        /// <response code="200">Retorna id da prefeitura atualizada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarPrefeituraResponse))]
        [Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarPrefeituraRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _prefeituraService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta uma prefeitura
        /// </summary>
        /// <response code="200">Retorna uma mensagem da ação executada</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarPrefeituraResponse))]
        [Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _prefeituraService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Método responsável por realizar o download do arquivo de logo
        /// </summary>
        /// <param name="id">Identificador da prefeitura</param>
        /// <param name="cancellationToken">Token de cancelamento</param>
        /// <returns>Retorna um stream contendo as informações do arquivo</returns>
        [HttpGet("downloadarquivologo/{id}")]
        [Authorize]
        public async Task<IActionResult> DownloadArquivoMedicaoAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _stream = await this._prefeituraService.DownloadArquivoLogo(id, cancellationToken);

                if (_stream != null)
                    return File(_stream, "application/octet-stream", this.CriarNomeArquivoAleatorio());

                return NotFound("Prefeitura não tem logo associado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao processar o download: {ex.Message}");
            }
        }

        private string CriarNomeArquivoAleatorio()
        {
            return ($"Arquivo_{DateTime.Now.ToString("ddMMyyyyhhmms")}");
        }
    }
}