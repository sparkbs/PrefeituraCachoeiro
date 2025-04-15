using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;
using System.Data;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento dos aditivos
    /// </summary>
    [Route("v1/aditivos")]
    [ApiController]
    public class AditivosController : Controller
    {
        private readonly IAditivosService _aditivosService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="aditivosService">Instância de IAditivosService</param>
        public AditivosController(IAditivosService aditivosService)
        {
            _aditivosService = aditivosService;
        }

        /// <summary>
        /// Cria um novo aditivo
        /// </summary>
        /// <response code="200">Retorna id do aditivo criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarAditivoResponse))]
        [Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarAditivoRequest requisicao, CancellationToken cancellationToken)
        {
            // Verificar se o arquivo foi enviado
            if (requisicao.ArquivoTemplate != null)
            {
                // Verificar se o arquivo é um arquivo Excel (extensão .xlsx)
                var fileExtension = Path.GetExtension(requisicao.ArquivoTemplate.FileName).ToLower();
                if (fileExtension != ".xlsx" && fileExtension != ".xlsb")
                    return BadRequest("Deve ser enviado um arquivo excel");

                //Verificar se o arquivo de template está no formato esperado
                var _formato = await this.VerificarArquivoTemplateProjeto(requisicao);
                var _resultado = (_formato as OkResult);

                if (_resultado != null && _resultado.StatusCode != 200)
                    return (_formato);
            }

            var response = await _aditivosService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        private async Task<IActionResult> VerificarArquivoTemplateProjeto(CriarAditivoRequest requisicao)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using (var stream = new MemoryStream())
            {
                await requisicao.ArquivoTemplate.CopyToAsync(stream);
                stream.Position = 0; // Garantir que a posição no stream seja zero antes de carregar

                // Usando ExcelDataReader para ler o arquivo .xlsb
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    var dataset = reader.AsDataSet();
                    var worksheet = dataset.Tables.Cast<DataTable>()
                        .FirstOrDefault(dt => dt.TableName.Equals("BASE DE DADOS", StringComparison.OrdinalIgnoreCase));

                    if (worksheet == null)
                        return BadRequest("O arquivo excel informado não está no padrão esperado");

                }
            }

            return Ok();
        }

        /// <summary>
        /// Retorna todos os aditivos de determinado contrato
        /// </summary>
        /// <response code="200">Retorna uma lista de aditivos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AditivosDataResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] AditivosContratoFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _aditivosService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna um aditivo pelo identificador
        /// </summary>
        /// <response code="200">Retorna um aditivo pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AditivosResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _aditivosService.BuscarPorIdAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um aditivo
        /// </summary>
        /// <response code="200">Retorna uma mensagem de confirmação</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarAditivoResponse))]
        [Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _aditivosService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Apagar um arquivo de aditivo
        /// </summary>
        /// <response code="200">Retorna uma mensagem de confirmação</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("apagararquivoaditivo/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarContratoResponse))]
        [Authorize]
        public async Task<IActionResult> DeletarArquivoAditivoAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _aditivosService.DeletarArquivoAnexadoAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Registrar um ou mais arquivos a um aditivo
        /// </summary>
        /// <response code="200">Retorna sucesso ou a mensagem de erro</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("registrardocumentos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RegistrarDocumentosAditivoResponse))]
        [Authorize]
        public async Task<IActionResult> RegistrarDocumentosAsync([FromForm] RegistrarDocumentosAditivoRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _aditivosService.RegistrarDocumentosAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Método responsável por realizar o download de um determinado arquivo do aditivo
        /// </summary>
        /// <param name="id">Identificador do arquivo</param>
        /// <param name="cancellationToken">Token de cancelamento</param>
        /// <returns>Retorna um stream contendo as informações do arquivo</returns>
        [HttpGet("downloadarquivoaditivo/{id}")]
        [Authorize]
        public async Task<IActionResult> DownloadArquivoAditivoAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var _stream = await this._aditivosService.DownloadArquivoAditivo(id, cancellationToken);

                return File(_stream, "application/octet-stream", this.CriarNomeArquivoAleatorio());
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