using Microsoft.AspNetCore.Mvc;
using PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Dominio.Extensoes;

namespace PrefeituraCachoeiro.Api.Controllers
{
    /// <summary>
    /// Controle responsável por realizar o login do usuário
    /// </summary>
    [Route("v1/login")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly ILoginService _loginService;

        /// <summary>
        /// Construtor parametrizado
        /// </summary>
        /// <param name="loginService">Instância da classe ILoginService</param>
        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        /// <summary>
        /// Verificar se o login e senha informados são válidos
        /// </summary>
        /// <response code="200">Retorna um token de acesso</response>
        /// <response code="401">O usuário não possui acesso autorizado pelo token informado.</response>
        [HttpPost("verificarlogin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(VerificarLoginResponse))]
        //[Authorize]
        public async Task<IActionResult> VerificarLoginAsync([FromBody] VerificarLoginRequest request, CancellationToken cancellationToken)
        {
            var response = await _loginService.VerificarLoginAsync(request, cancellationToken);

            return response.Match(
              onSuccess: Ok,
              onFailure: error => error.ToHttpResponseError());
        }
    }
}