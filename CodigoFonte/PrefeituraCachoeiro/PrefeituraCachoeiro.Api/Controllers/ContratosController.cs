using Amazon.S3.Model.Internal.MarshallTransformations;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Dtos.Respostas;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dados.Filtros;
using PrefeituraCachoeiro.Dominio.Extensoes;
using System.Data;
using System.Text;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controller responsável pelo gerenciamento dos contratos
    /// </summary>
    [Route("v1/contratos")]
    [ApiController]
    public class ContratosController : Controller
    {
        private readonly IContratosService _contratosService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="contratosService">Instância de IContratosService</param>
        public ContratosController(IContratosService contratosService)
        {
            _contratosService = contratosService;
        }

        /// <summary>
        /// Retorna um contrato pelo identificador
        /// </summary>
        /// <response code="200">Retorna um contrato pelo identificador</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ContratosResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarPorIdAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _contratosService.BuscarPorIdAsync(id, cancellationToken);
            var _result = new StringBuilder();

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os contratos de acordo com os parâmetros de pesquisa
        /// </summary>
        /// <response code="200">Retorna uma lista de contratos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ContratosDataResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarTodosAsync([FromBody] ContratosFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _contratosService.BuscarTodosAsync(filtro, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Retorna todos os aditivos de um contrato
        /// </summary>
        /// <response code="200">Retorna uma lista de aditivos</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("buscartodosaditivos")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ContratosDataResponse))]
        [Authorize]
        public async Task<IActionResult> BuscarTodosAditivosAsync([FromBody] AditivosContratoFilter filtro, CancellationToken cancellationToken)
        {
            var response = await _contratosService.BuscarTodosAditivosAsync(filtro.IdContrato, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Cria um novo contrato
        /// </summary>
        /// <response code="200">Retorna id do contrato criado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CriarContratoResponse))]
        [Authorize]
        public async Task<IActionResult> InserirAsync([FromForm] CriarContratoRequest requisicao, CancellationToken cancellationToken)
        {
            // Verificar se o arquivo foi enviado
            if (requisicao.ArquivoTemplate == null)
                return BadRequest("A propriedade ArquivoTemplate deve ser preenchida");

            // Verificar se o arquivo é um arquivo Excel (extensão .xlsx)
            var fileExtension = Path.GetExtension(requisicao.ArquivoTemplate.FileName).ToLower();
            if (fileExtension != ".xlsx" && fileExtension != ".xlsb")
                return BadRequest("Deve ser enviado um arquivo excel");

            //Verificar se o arquivo de template está no formato esperado
            var _formato = await this.VerificarArquivoTemplateProjeto(requisicao);
            var _resultado = (_formato as OkResult);

            if (_resultado != null && _resultado.StatusCode != 200)
                return (_formato);

            var response = await _contratosService.InserirAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Atualiza um contrato.
        /// </summary>
        /// <response code="200">Retorna id do contrato atualizado</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AtualizarContratosResponse))]
        [Authorize]
        public async Task<IActionResult> AtualizarAsync([FromForm] AtualizarContratosRequest requisicao, CancellationToken cancellationToken)
        {
            var response = await _contratosService.AtualizarAsync(requisicao, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um contrato
        /// </summary>
        /// <response code="200">Retorna uma mensagem de confirmação</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DeletarContratoResponse))]
        [Authorize]
        public async Task<IActionResult> DeletarAsync(int id, CancellationToken cancellationToken)
        {
            var response = await _contratosService.DeletarAsync(id, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Deleta um determinado projeto de determinado contrato
        /// </summary>
        /// <response code="200">Retorna uma mensagem de confirmação</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpDelete("removerprojetocontrato")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RemoverProjetoContratoResponse))]
        [Authorize]
        public async Task<IActionResult> RemoverProjetoContratoAsync([FromBody] RemoverProjetoContratoRequest request, CancellationToken cancellationToken)
        {
            var response = await _contratosService.RemoverProjetoContratoAsync(request, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        /// <summary>
        /// Adicionar um determinado projeto a determinado contrato
        /// </summary>
        /// <response code="200">Retorna uma mensagem de confirmação</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("adicionarprojetocontrato")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AdicionarProjetoContratoResponse))]
        [Authorize]
        public async Task<IActionResult> AdicionarProjetoContratoAsync([FromBody] AdicionarProjetoContratoRequest request, CancellationToken cancellationToken)
        {
            var response = await _contratosService.AdicionarProjetoContratoAsync(request, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }

        private async Task<IActionResult> VerificarArquivoTemplateProjeto(CriarContratoRequest requisicao)
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
    }
}